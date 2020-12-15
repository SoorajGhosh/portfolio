let mobileView, menu=true;


// ======================= Function to detect/set Responivness ========================
// (NEEDS TO BE HERE BCZ SETTING MOBILEVIEW EARLY ON CODE TO DETECT IF MOBILE OR NOT)
(function responsive(){
    let media = window.matchMedia("(max-width: 600px)")

    let checkMedia = mediaQuery => {
        mobileView = mediaQuery.matches;
        return mobileView;
    }

    checkMedia(media);

    media.addListener(checkMedia)
})();


let uiElements = (function(){

    let dom ={
        menuBtn : document.querySelector('.menu-btn'),
        inner : document.querySelector('.inner'),
        nav : document.querySelector('.nav'),
        navLinks : Array.from(document.querySelectorAll('.nav-links')),
        navUl : document.querySelector('.nav-ul'),
        targetBtns : document.querySelectorAll('.target-btn'),
        aboutSection: document.querySelector('.about'),
        aboutDotContainer: document.querySelector('.about_dots_container'),
        abutDots:  Array.from(document.querySelectorAll('.about_dot')),
        aboutWrap: document.querySelector('.about-wrap'),
        aboutContainer: document.querySelector('.about-container'),
        aboutCards: Array.from(document.querySelectorAll('.about-card')),
    }

    return {dom,}
})(); 





//========================== NAVBAR =================================

function navbarFn(domEl){
    // Showing/Removing the NAV Function
    const showNav = function(){
        domEl.inner.classList.toggle('inner-hidden');
        domEl.navLinks.map((cur)=>cur.classList.toggle('nav-links-show'))
        domEl.navUl.classList.toggle('nav-ul-center');
        domEl.menuBtn.classList.toggle('menu-btn-click');
    }

    // Event Handler to handle the mobile nav menu button
    domEl.menuBtn.addEventListener('click', showNav);

    // Event Handler for handling going to sections after clinking a nav link
    domEl.nav.addEventListener('click', function(e){
        e.preventDefault();
        const section_id = e.target.closest('.nav-target')?.getAttribute('href');
        if (!section_id) return;
        (section_id!=='#intro-section') ? showNav():undefined;
        document.querySelector(section_id).scrollIntoView({behavior:'smooth'});
    });

}





// ============================== Target Anchors Function =================================

function targetAnchorsFn(domEl){

    // In between links to go somewhere on the page
    domEl.targetBtns.forEach((cur)=>cur.addEventListener('click', function(e){
        e.preventDefault();
        const sectionID = e.target.getAttribute('href')
        document.querySelector(sectionID).scrollIntoView({behavior:'smooth'});
    }));

}





// ================================= About Section ========================================

function aboutFn(domEl){
    
    //============ Dots Functionality ====================
    
    function aboutDotsFn(){
        // Creating the Dots for each Card
        const createDots = function(cards){
            cards.forEach((_,i) => { 
                const dotHtml = `<a class="about_dot" href="#about-card-${i}" data-dot="${i}">${i+1}</a>`
                domEl.aboutDotContainer.insertAdjacentHTML('beforeend', dotHtml)
            });
        }
        createDots(domEl.aboutCards)

        let dots = document.querySelectorAll('.about_dot');

        // Function for activating the current card Dot
        function activateDot(idx){
            dots.forEach((dot, i) => {dot.classList.remove('about_dot-active')})    // Remoing any active dots before setting the active dot
            document.querySelector(`.about_dot[data-dot="${idx}"]`).classList.add('about_dot-active');
        }

        // Click Event for each dot
        dots.forEach((dot, i) => {
            dot.addEventListener('click',(e)=>{
                e.preventDefault();                 // Removing default behaviour
                activateDot(i);
            })
        })

        // Creating the Hover effect using js coz if not like this it causes problems in mobileview
        dots.forEach((dot, i) => {
            dot.addEventListener('mouseover',(e)=>{
                e.preventDefault();                 
                if (mobileView) return
                e.target.classList.add('about_dot-active')
            })
        })

        dots.forEach((dot, i) => {
            dot.addEventListener('mouseout',(e)=>{
                e.preventDefault();                 
                if (mobileView) return
                e.target.classList.remove('about_dot-active')
            })
        })
    }
    

    aboutDotsFn();



    // ============ Infinite Scrolling of cards ================
    
    function infiniteScroll(){
    
        const wrap= document.querySelector('.about-wrap');
        const cardContainer= document.querySelector('.about-container');
        const actualCards = Array.from(document.querySelectorAll('.about-card'));
        const defaultInterval = 3000;
        let interval = defaultInterval;
        let activePosition =(mobileView?(wrap.clientWidth/4.5):(wrap.clientWidth)/2);
        let index = 1;
        let activeCardIndex;
        let activeCard;
        let activeCardXPos;
        let allCardsXPosArr;
        // DRAG VARIABLES
        let initialPosition = null;
        let dragMoving = false;
        let transform = 0;
        let cardClicked=false;
    
        // Widths of card and all cards together
        const totalCardsWidth = (actualCards[index].offsetWidth)*actualCards.length;
        const cardWidth = actualCards[index].clientWidth;
    
        const getCards = () => Array.from(document.querySelectorAll('.about-card'));
        const actualCardPositionIdx = (acIdx) => getCards().indexOf(actualCards[acIdx]);    // Getting position of actual cards in total array

        let setActiveCard = (activeCardIdx) =>  {
            activeCard = getCards()[activeCardIdx];
            getCards().forEach(card=>card.classList.remove('about-card-active'));
            activeCard?.classList.add('about-card-active');
            activeCardIndex = getCards().indexOf(activeCard);
            activeCardXPos = allCardsXPosArr[activeCardIdx]
            cardContainer.style.transform = `translateX(${-activeCardXPos+(activePosition)}px)`;
        };
    
    
        // Adding Previous cards
        const prevCardsClone = actualCards.map(function(card,i){
            const cloneCard = actualCards[(actualCards.length-1)-i].cloneNode(true);
            cloneCard.classList.add('prev-cards');
            cardContainer.insertAdjacentElement('afterbegin',cloneCard);
            return cloneCard
        })
    
        // Adding Next cards
        const nextCardsClone = actualCards.map(function(card){
            const cloneCard = card.cloneNode(true);
            cloneCard.classList.add('next-cards');
            cardContainer.insertAdjacentElement('beforeend',cloneCard);
            return cloneCard
        })
    
        //Getting all the x positions of all the cards including prev and next and declaring here bcz we will need it for positioning the active card x position
        allCardsXPosArr = getCards().map((card,i)=>card.getBoundingClientRect().x);				
    
        // Seting the First Active card as the 0th card of the actual cards
        setActiveCard(actualCardPositionIdx(0));			
    
        // Moving Left to Right
        const moveToNextCard = () => {                                                  // FIRST CARD SWITCH PROBLEM IDEA: first switch then transition
            const lastActualCard = actualCardPositionIdx(actualCards.length-1);
            const firstActualCard = actualCardPositionIdx(0);
            
            if (activeCardIndex > lastActualCard){                                    // If card in next Cards
                cardContainer.style.transition = 'none';
                setActiveCard(activeCardIndex-actualCards.length);
                interval=50;
            
            } else if (activeCardIndex < firstActualCard){                            // If card in previous cards
                cardContainer.style.transition = 'none';
                setActiveCard(activeCardIndex+actualCards.length);
                interval=50;
            
            } else {
                cardContainer.style.transition = '.7s ease-out';
                activeCardIndex++;
                setActiveCard(activeCardIndex);
                if (cardClicked){
                    cardClicked = false;
                } else {
                    interval=defaultInterval;
                }
                
            }
        };
            
        // SRC: https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
    
        function startMovingCardsContainer() {         		                //  create a loop function
            setTimeout(function() {   						                //  call a interval setTimeout when the loop is called
                if (!dragMoving && !cardClicked) moveToNextCard();          //  your code here
                startMovingCardsContainer();
            }, interval)
        }
        startMovingCardsContainer();                   		                //  start the loop
    



        // Drag functionality
        
        const gestureStart = (e) => {
            initialPosition = e.pageX;
            dragMoving = true;
            wrap.style.cursor ='grabbing';
            const transformMatrix = window.getComputedStyle(cardContainer).getPropertyValue('transform');
            if (transformMatrix !== 'none') {
                transform = parseInt(transformMatrix.split(',')[4].trim());
            }
        }

        const gestureMove = (e) => {
            if (dragMoving) {
                const currentPosition = e.pageX;
                wrap.style.cursor ='grabbing';
                const diff = currentPosition - initialPosition;
                cardContainer.style.transform = `translateX(${transform + diff}px)`;  
                cardContainer.style.transition = 'none';    // IMPORTANT BECAUSE IT MAKES THE MOVEMENT DURING GRABBING SMOOTH
            }
        };

        const gestureEnd = (e) => {
            dragMoving = false;
            wrap.style.cursor ='grab';
        }
        
        const clickedFn = function (e){
            const card = e.target.closest('.about-card')
            const cardId = getCards().indexOf(card);
            cardClicked = true;
            cardContainer.style.transition = '.7s ease-out';
            setActiveCard(parseInt(cardId));
            cardClicked = false;
        }

        // Activating Card while moving
        const draggingActiveCard = function (entries, observer){
            const [entry]=entries;
            if (dragMoving) {
                // console.log(getCards().indexOf(entry.target))	
                setActiveCard(getCards().indexOf(entry.target));
            };
        }

        const wrapObserver = new IntersectionObserver(draggingActiveCard,{root:wrap, threshold: 1, rootMargin: `${activePosition}px` });

        getCards().forEach(card=>{wrapObserver.observe(card)})


        // Event Listeners for About slider
        if (window.PointerEvent) {
            wrap.addEventListener('pointerdown', gestureStart);
            wrap.addEventListener('pointermove', gestureMove);
            wrap.addEventListener('pointerup', gestureEnd);  
        } else {
            wrap.addEventListener('touchdown', gestureStart);
            wrap.addEventListener('touchmove', gestureMove);
            wrap.addEventListener('touchup', gestureEnd);  
            wrap.addEventListener('mousedown', gestureStart);
            wrap.addEventListener('mousemove', gestureMove);
            wrap.addEventListener('mouseup', gestureEnd);  
        }
        cardContainer.addEventListener('click', clickedFn);     // click funcion must always work


    }
    

    infiniteScroll();

    

}





// ===============Controller (Combines all page component functions) ======================
let controller = (function(){
    const dom = uiElements.dom;

    // Page Components
    navbarFn(dom);
    
    targetAnchorsFn(dom);

    aboutFn(dom);
    
})();





// Setting the Page height according to the phone's window in responsive. Solution SOURCE: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vw', `${vw}px`);


























/*


            function createInfinte(activeCardIdx){
            
                let cards = document.querySelectorAll(".about-card");

                // 1. Check the next card
                let nextActive = cards[activeCardIdx+1];
                // console.log('NextActive: ',nextActive);
    
                // 2. Check if the next card has a next or not 
                let nextCard = cards[activeCardIdx+2];
                // console.log('NextCard: ',nextCard);
                
                // 3. IF there no need to add new 
                if (!nextCard){
                    if (activeCardIdx+1 === cards.length-1){
                        cloneCard = cards[0].cloneNode(true);
                    } else {
                        cloneCard = cards[activeCardIdx+1].cloneNode(true);
                    }
                    domEl.aboutContainer.insertAdjacentElement('beforeend',cloneCard);
                    console.log(cards);
                    // cards.push(cloneCard);
                } 
    
                // 4. If not then add a new card 
                // 5. Check if its the last card then add the first card from the list of cards.
                // 6. If not then make sure that card to be added is the next card in the sequence

            }
    
            function aboutCardIntersectionFn(entries){
                const [entry] = entries;
        
                // Add or remove the active card class depedning on if its intersecting (entering) or not (exiting)
                if (entry.isIntersecting===true){
                    entry.target.classList.add("about-card-active");
                    const idx = parseInt(entry.target.dataset.card);              // Getting the Id number fo slide
                    createInfinte(idx);                                           // Infinite slide functionality goes here
                    activateDot(idx);
                } else {
                    entry.target.classList.remove("about-card-active")      // removing the active card if intersecting goes false
                }
            }
    
            // About Card Observer
            var aboutContainerObserver = new IntersectionObserver(aboutCardIntersectionFn, {root: domEl.aboutContainer, threshold:1, rootMargin:'0px'});
            document.querySelectorAll('.about-card').forEach(function(card){
                aboutContainerObserver.observe(card);
            })
*/



/*
    const interval = 3000;
    const container = domEl.aboutContainer;
    let cards = document.querySelectorAll('.about-card');
    let index = 1;
    let cardId;
        
    //Creating Clones to be added at the end and start of the container
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);
    
    // Setting the ID of the clone cards in case we need to identify them later   
    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';
    
    // Addng the clones to the array of card in the container
    container.append(firstClone);
    container.prepend(lastClone);

    // Card width which is going to be used for setting the moving the cotainer to the 2nd element of the array which is the actual first
    const cardWidth = cards[index].clientWidth;

    // Moving the contianer to show the first element first
    container.style.transform = `translateX(${-cardWidth * index}px)`;
        
    // Getting the currents slides in the container
    const getCards = () => document.querySelectorAll('.about-card');

    // Moving Left to Right
    const moveToNextCard = () => {
        cards = getCards();
        if (index >= cards.length - 1) return;
        index++;
        container.style.transition = '.7s ease-out';
        container.style.transform = `translateX(${-cardWidth * index}px)`;
    };
    
    // Moving Right to Left
    const moveToPreviousCard = () => {
        if (index <= 0) return;
        index--;
        container.style.transition = '.7s ease-out';
        container.style.transform = `translateX(${-cardWidth * index}px)`;
    };

    //Automatic Moving slider function        
    const startMovingCardsContainer = () => {
        cardId = setInterval(() => {
        moveToNextCard();
        }, interval);
    };

    // Calling the function (later put it in a init function)
    startMovingCardsContainer();
  
    // Adding the Rest of the slides transition after it reaches slide 1 clone  
    container.addEventListener('transitionend', () => {
        cards = getCards();
        if (cards[index].id === firstClone.id) {
            container.style.transition = 'none';
            index = 1;
            container.style.transform = `translateX(${-cardWidth * index}px)`;
        }
        
        if (cards[index].id === firstClone.id) {
            container.style.transition = 'none';
            index = cards.length - 2;
            container.style.transform = `translateX(${-cardWidth * index}px)`;
        }
    });
    
*/



            // let addCard=undefined;
            // const cards = domEl.aboutCards;
            // console.log(activeCardIdx, cards.length-2)
            // if (activeCardIdx===cards.length-2){
            //     addCard = cards[0].cloneNode(true);
            // }
            // addCard && domEl.aboutContainer.append(addCard)

// if (cardId > lastActualCard){
            //     selectCardId = cardId-actualCards.length;
            // } else if ( cardId < firstActualCard){
            //     selectCardId = cardId+actualCards.length;
            // } else {
            //     selectCardId = cardId;
            // }







        // function movingCardContainer(xPos){
        //     // cardContainer.style.transform = `translateX(${-xPos+wrap.getBoundingClientRect().x}px)`;		// card to the start of wrap 
        //     cardContainer.style.transform = `translateX(${-xPos+(activePosition)}px)`;					// card to the middle of wrap
        // }
    
        // // Moving the container to the 1st element of the actual array
        // // movingCardContainer(activeCardXPos);	
    
