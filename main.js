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
    // SRC: https://www.youtube.com/watch?v=DqkH_PV5cto&list=LL&index=13

    function infiniteScroll(){
    
        const wrap= document.querySelector('.about-wrap');
        const cardContainer= document.querySelector('.about-container');
        const actualCards = Array.from(document.querySelectorAll('.about-card'));
        let defaultInterval = 3000;
        let activePosition =(mobileView?(wrap.clientWidth/4.5):(wrap.clientWidth)/2);
        let index = 1;
        let activeCardIndex;
        let activeCard;     
        let allCardsXPosArr;    // Positions of all Cards on x axis
        let activeCardXPos;     // Position of Active card in allCardsXPos
        // DRAG VARIABLES
        let initialPosition = null;
        let grabbed = false;    // shows if container grabbed or not
        let dragged = false;    // shows if container dragged or not 
        let transform = 0;      // Needed for resuming movement of container when dragging is stopped temporarily
        let timerFn;
    
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
        const moveToNextCard = () => {                                                // FIRST CARD SWITCH PROBLEM IDEA: first switch then transition
            const lastActualCard = actualCardPositionIdx(actualCards.length-1);
            const firstActualCard = actualCardPositionIdx(0);
            
            if (activeCardIndex > lastActualCard){                                    // If card in next Cards
                cardContainer.style.transition = 'none';
                setActiveCard(activeCardIndex-actualCards.length);
                defaultInterval=50;
            
            } else if (activeCardIndex < firstActualCard){                            // If card in previous cards
                cardContainer.style.transition = 'none';
                setActiveCard(activeCardIndex+actualCards.length);
                defaultInterval=50;
            
            } else {
                cardContainer.style.transition = '.7s ease-out';
                activeCardIndex++;
                setActiveCard(activeCardIndex);
                defaultInterval=3000;
                
            }
        };
          
        
        // SRC: https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
    
        function startMovingCardsContainer(interval) {         	//  create a loop function
            timerFn = setTimeout(function() {   				//  call a interval setTimeout when the loop is called
                moveToNextCard()                                //  your code here
                startMovingCardsContainer(defaultInterval);                
            }, interval)
        }

        startMovingCardsContainer(defaultInterval);             //  start the loop
    

        
        // Drag functionality
        // SRC: https://www.youtube.com/watch?v=YxMtL6lJbZw&list=LL&index=11&t=147s
        
        const gestureStart = (e) => {
            initialPosition = e.pageX;
            grabbed = true;
            wrap.style.cursor ='grabbing';
            const transformMatrix = window.getComputedStyle(cardContainer).getPropertyValue('transform');
            if (transformMatrix !== 'none') {
                transform = parseInt(transformMatrix.split(',')[4].trim());
            }
        }

        const gestureMove = (e) => {
            if (grabbed) {
                dragged = true;
                const currentPosition = e.pageX;
                wrap.style.cursor ='grabbing';
                const diff = currentPosition - initialPosition;
                cardContainer.style.transform = `translateX(${transform + diff}px)`;  
                cardContainer.style.transition = 'none';                            // IMPORTANT BECAUSE IT MAKES THE MOVEMENT DURING GRABBING SMOOTH
                clearTimeout(timerFn);                                              // stops timer function
                startMovingCardsContainer(defaultInterval);                         // Restarting the timer
            }
        };

        const gestureEnd = (e) => {
            grabbed = false;
            wrap.style.cursor ='grab';
            const card = e.target.closest('.about-card')
            const cardId = getCards().indexOf(card);
            // Check if dragged if not then perform click action
            if (dragged) {
                dragged = false;
            } else {
                // Setting Clicking functionality here bcz otherwise it will click every time dragged and pointer / mouse button lifted
                cardContainer.style.transition = '.7s ease-out';
                setActiveCard(parseInt(cardId));
                clearTimeout(timerFn);
                startMovingCardsContainer(defaultInterval);                         // Restarting the timer after the gap
            }
        }
       

        // Activating Card while moving
        const draggingActiveCard = function (entries, observer){
            const [entry]=entries;
            if (grabbed && entry.isIntersecting) {	
                setActiveCard(getCards().indexOf(entry.target));
            };
        }


        const wrapObserverOptions = function (){
            let marginDist = mobileView ? (cardWidth/4) : (cardWidth);
            return {
                root:wrap, 
                threshold: 1, 
                rootMargin: `0px -${marginDist}px 0px -${marginDist}px` 
            }
        }

        const wrapObserver = new IntersectionObserver(draggingActiveCard, wrapObserverOptions());

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





















