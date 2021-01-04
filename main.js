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

        // =============== ABOUT ===================
        aboutSection: document.querySelector('.about'),
        aboutDotContainer: document.querySelector('.about_dots_container'),
        abutDots:  Array.from(document.querySelectorAll('.about_dot')),
        aboutWrap: document.querySelector('.about-wrap'),
        aboutContainer: document.querySelector('.about-container'),
        aboutCards: Array.from(document.querySelectorAll('.about-card')),

        // =============== PROJECT ===================
        projectSection: document.querySelector('.project'),
        projectTitle: document.querySelector('.project-title'),
        projectNames: document.querySelectorAll('.project-name'),
        projectArea: document.querySelector('.project-area'),
        projectDetails: document.querySelector('.project-details'),
        projectDetailsBtns: document.querySelectorAll('.project-details-btn'),
        projectArrows: document.querySelectorAll('.project-arrow'),
        projectFrame: document.querySelector('.project-frame'),
        projectSlider: document.querySelector('.project-slider'),
        projectSlides: Array.from(document.querySelectorAll('.project-slide')),
        projectContents: document.querySelectorAll('.project-content'),
        projectProcess: document.querySelectorAll('.project-process'),
        projectImages: document.querySelector('.project-image'),
        projectLearnings: document.querySelectorAll('.project-learning'),
        projectBtns: document.querySelectorAll('.project-btn'),
        projectSubtext: document.querySelector('.project-subtext')
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









// ======================= SLIDER FUCNTION CONSTRUCTOR ========================
{


// ============ Infinite Scrolling of cards ================
// SRC: https://www.youtube.com/watch?v=DqkH_PV5cto&list=LL&index=13
function sliderObj({wrapper, cardContainer, actualCards, slideMoveWidth,transformDist, defaultInterval, activeCardClassName, dotContainer, cardType, dotClass, dotHoverClass, activeDotClass, mobileView, observerMarginDist, cardSetActiveThreshold, simultaneousChangingElementsArr}){    
    
    // -----------PROPERTY DESCRIPTION-----------
    // wrapper = wrapper of the card container
    // cardContainer = conainer of the cards
    // actualCards = real cards
    // slideMoveWidth = width or the distance for the contianer to be moved in order to slide to the active slide
    // transformDist = the distance the card container will cover in each slide movement while setting the active card 
    // defaultInterval = the interval with which the function of moving the slide contianer will be called
    // activeCardClassName = the class name for active Card
    // dotContainer = this is the container for dots 
    // cardType = give a unique name for each instance as this will be used to make the class names for dots and also keep in mind to specify the CSS for this
    // dotClass = class name for all dots
    // dotHoverClass = hover class for dots
    // activeDotClass = class name for the active dot
    // mobileView = Boolean value that states the responsiveness
    // observerMarginDist = the distance inside the card wrapper to be kept to check the card if its crosssing its threshold for being active card
    // cardSetActiveThreshold = the percentage of visiblility required to set a card to active, used in the observer options
    // simultaneousChangingElementsArr = Array of elements that will change simultaneously along with the change in active card based on actual card id
    // ( set the active class for the simultaneous elements as this: ==> 'simultaneousClass'+'-active')

    // CSS - dots css to be looked for while setting the css properties to match the naming {dotClass-text}


    // VARIBALES
    this.wrapper = wrapper;
    this.cardContainer = cardContainer;
    this.actualCards = actualCards;
    this.slideMoveWidth = slideMoveWidth;
    this.transformDist = transformDist;
    this.defaultInterval = defaultInterval;
    this.activeCardClassName = activeCardClassName;
    this.dotContainer = dotContainer;
    this.cardType = cardType;
    this.dotClass = dotClass;
    this.dotHoverClass = dotHoverClass;
    this.activeDotClass = activeDotClass;
    this.mobileView = mobileView;
    this.observerMarginDist = observerMarginDist;
    this.cardSetActiveThreshold = cardSetActiveThreshold,
    this.simultaneousChangingElementsArr = simultaneousChangingElementsArr;
    this.simClassName= this.simultaneousChangingElementsArr && this.simultaneousChangingElementsArr[0][0].className;   // getting simultanous class name 

    // Computed Variables or later declared Variables
    // All Varibales stay here bcz they are used in all the methods and may need to be called before init so they may not even be hoisted
    this.activeCardIndex;
    this.activeCard;
    this.allCardsXPosArr;                               // Positions of all Cards on x axis
    this.activeCardXPos;                                // Position of Active card in allCardsXPos
    this.cardClass = this.actualCards[0].className;
    this.dots;
    // DRAG VARIABLES
    this.initialPosition = null;
    this.grabbed = false;                               // shows if container grabbed or not
    this.dragged = false;                               // shows if container dragged or not 
    this.transform = 0;                                 // Needed for resuming movement of container when dragging is stopped temporarily
    
    this.timerFn;
    this.timerInterval = this.defaultInterval
    
    // Widths of card and all actualCards together
    this.totalCardsWidth = (this.actualCards[0].offsetWidth)*this.actualCards.length;
    // this.cardWidth = this.actualCards[0].clientWidth;
        
    this.getCards = () => Array.from(document.querySelectorAll(`.${this.cardClass}`));
    this.actualCardPositionIdx = (acIdx) => this.getCards().indexOf(this.actualCards[acIdx]);    // Getting position of actual Cards in total array

}   


// PROTOTYPES OF DRAG AND MOVE OBJECT

// Set Active card
sliderObj.prototype.setActiveCard = function(activeCardIdx){
    this.activeCard = this.getCards()[activeCardIdx];
    this.getCards().forEach(card=>card.classList.remove(this.activeCardClassName));
    this.activeCard?.classList.add(this.activeCardClassName);
    this.activeCardIndex = this.getCards().indexOf(this.activeCard);
    this.activeCardXPos = this.allCardsXPosArr[activeCardIdx];
    this.cardWidth = (parseFloat(getComputedStyle(this.activeCard).width) + parseFloat(getComputedStyle(this.activeCard).marginLeft) + parseFloat(getComputedStyle(this.activeCard).marginRight));  // everything here is computed bcz we need the whole width of the elements with decimals to be exact
    this.wrapperWidth = (parseFloat(this.wrapper.clientWidth)); // this need to be client width bcz we need just the inner width
    // calculated the transform width for the container by subtracting the wrapper's half by cards width with the active index
    this.transformDist = (this.wrapperWidth/2)-parseFloat(getComputedStyle(this.wrapper).paddingLeft)-(this.cardWidth*(activeCardIdx+0.5));
    this.cardContainer.style.transform = `translateX(${this.transformDist}px)`;
    this.activeActualCardIdx = parseInt(this.activeCard.dataset.card);  // setting an object property to the index of the actual card that is active
    this.activateDot(this.activeActualCardIdx)                          // Activating the current Dot
    this.simultaneousChangingElementsArr && this.changeSimultaneous(); // &&: bcz we are checking if there is any element to be set active simultaneously or not
};

// Changing simultaneous elements function 
sliderObj.prototype.changeSimultaneous = function (){
    this.simultaneousChangingElementsArr.forEach((elementArr) => {
        elementArr.forEach((cur)=>cur.classList.remove(this.simClassName+'-active'));    // removing the active class from any element previously active
        elementArr[this.activeActualCardIdx].classList.add(this.simClassName+'-active'); // activating the correct element based on active index
    })
}

// Moving Left to Right
sliderObj.prototype.moveToNextCard = function(idx){                       // FIRST CARD SWITCH PROBLEM IDEA: first switch then transition
    if (idx > this.lastActualCardIdx){                                    // If card in next Cards
        this.cardContainer.style.transition = 'none';
        this.setActiveCard(idx-this.actualCards.length);
        this.timerInterval=50;
    
    } else if (idx < this.firstActualCardIdx){                            // If card in previous cards
        this.cardContainer.style.transition = 'none';
        this.setActiveCard(idx+this.actualCards.length);
        this.timerInterval=50;
    
    } else {
        this.cardContainer.style.transition = '.7s ease-out';
        idx++;
        this.setActiveCard(idx);
        this.timerInterval=this.defaultInterval;
        
    }
};


// Auto Movement
// SRC: https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop 
sliderObj.prototype.moveCardContainerAtInervalFn = function(interval) {         	//  create a loop function
    // Used arrow function so as to set the "this" in the function to the object itself
    this.timerFn = setTimeout(() => {   				                            //  call a interval setTimeout when the loop is called 
        this.moveToNextCard(this.activeCardIndex)                                                       //  your code here
        this.moveCardContainerAtInervalFn(this.timerInterval);                
    }, interval)
}


// Setting the active card explicitly
sliderObj.prototype.setActiveCardExplicitly = function(idx){ 
    // setting the transition of explicitly changing cards with NONE is good to make the transition look flawless and seamless without abruption
    clearTimeout(this.timerFn);
    this.cardContainer.style.transition = 'none';
    if (idx<this.firstActualCardIdx){idx=idx+this.actualCards.length}
    else if (idx>this.lastActualCardIdx){idx=idx-this.actualCards.length}          
    this.setActiveCard(idx);
    this.moveCardContainerAtInervalFn(this.timerInterval);                         // Restarting the timer after the gap
}


// Gesture functions for movemnet of the slider
sliderObj.prototype.gestureStart = function(e){
    this.initialPosition = e.pageX;
    this.grabbed = true;
    this.wrapper.style.cursor ='grabbing';
    const transformMatrix = window.getComputedStyle(this.cardContainer).getPropertyValue('transform');
    if (transformMatrix !== 'none') {
        this.transform = parseInt(transformMatrix.split(',')[4].trim());
    }
}


sliderObj.prototype.gestureMove = function(e){
    if (this.grabbed) {
        this.dragged = true;
        const currentPosition = e.pageX;
        this.wrapper.style.cursor ='grabbing';
        const diff = currentPosition - this.initialPosition;
        this.cardContainer.style.transform = `translateX(${this.transform + diff}px)`;  
        this.cardContainer.style.transition = 'none';                            // IMPORTANT BECAUSE IT MAKES THE MOVEMENT DURING GRABBING SMOOTH
        clearTimeout(this.timerFn);                                              // stops timer function
        this.moveCardContainerAtInervalFn(this.timerInterval);                         // Restarting the timer
    }
};


sliderObj.prototype.gestureEnd = function(e){
    this.grabbed = false;
    this.wrapper.style.cursor ='grab';
    const card = e.target.closest(`.${this.cardClass}`)
    const cardId = this.getCards().indexOf(card);
    // Check if dragged if not then perform click action
    if (this.dragged) {
        this.dragged = false;
        this.setActiveCard(this.activeCardIndex);           // To position the Active card correctly in the place of active cards after leaving the grab hold.
        this.setActiveCardExplicitly(this.activeCardIndex); // this line will set the active card back to actual card based on the active card index
    } else {
        // Setting Clicking functionality here bcz otherwise it will click every time dragged and pointer / mouse button lifted
        this.setActiveCardExplicitly(parseInt(cardId));
    }
}


// Activating Card while moving
sliderObj.prototype.draggingActiveCard = function (entries, observer){
    const [entry]=entries;
    if (this.grabbed && entry.isIntersecting) {
        this.setActiveCard(this.getCards().indexOf(entry.target));
    };
}


// Observer Options
sliderObj.prototype.wrapObserverOptions = function (){
    return {
        root:this.wrapper, 
        threshold: this.cardSetActiveThreshold || 0.7, 
        rootMargin: `0px -${this.observerMarginDist}px 0px -${this.observerMarginDist}px` 
    }
}


// ====================== ABOUT DOTS ==========================

// This section must be here in the code before setActiveCard so as not to cause uncaught error

// Creating the Dots for each Card
sliderObj.prototype.createDots = function(){
    this.actualCards.forEach((_,i) => { 
        const dotHtml = `<a class="${this.dotClass}" href="#${this.cardType}-card-${i}" data-dot="${i}"><span class="${this.dotClass}-text">${i+1}</span></a>`
        this.dotContainer.insertAdjacentHTML('beforeend', dotHtml)
    });
    this.dots = document.querySelectorAll(`.${this.dotClass}`);     
}
    

// Function for activating the current card Dot
sliderObj.prototype.activateDot = function(idx){
    this.dots.forEach((dot, i) => {dot.classList.remove(this.activeDotClass)})    // Remoing any active dots before setting the active dot
    this.dots[idx].classList.add(this.activeDotClass);
}
    

// ================= INITIALISATION FUNCTION =========================

// Outside bcz many functions are declared outside which needs to be called in this init function 
sliderObj.prototype.init = function(){
    // Setting the dataset and id value calue for all actuals cards
    this.actualCards.forEach((cur,i)=>{
        cur.setAttribute('data-card',i);
        cur.id = `${this.cardType}-card-${i}`
    });
    
    // Creating Dots for the cards
    this.createDots()

    // Adding Previous actualCards
    const prevCardsClone = this.actualCards.map(function(card,i,arr){
        const cloneCard = arr[(arr.length-1)-i].cloneNode(true);
        cloneCard.classList.add(`prev-${this.cardClass}`);
        this.cardContainer.insertAdjacentElement('afterbegin',cloneCard);
        return cloneCard
    }, this)

    // Adding Next cards
    const nextCardsClone = this.actualCards.map(function(card,i,arr){
        const cloneCard = card.cloneNode(true);
        cloneCard.classList.add(`next-${this.cardClass}`);
        this.cardContainer.insertAdjacentElement('beforeend',cloneCard);
        return cloneCard
    }, this)

    // Getting the first and last actual cards index in the array of all cards includin previous and last cards
    this.lastActualCardIdx = this.actualCardPositionIdx(this.actualCards.length-1);
    this.firstActualCardIdx = this.actualCardPositionIdx(0);

    //Getting all the x positions of all the cards including prev and next and declaring here bcz we will need it for positioning the active card x position
    this.allCardsXPosArr = this.getCards().map((card,i)=>card.getBoundingClientRect().x);	

    // Seting the First Active card as the 0th card of the actual cards
    this.setActiveCard(this.actualCardPositionIdx(0));

    //  start the movement loop
    this.moveCardContainerAtInervalFn(this.timerInterval); 
    
    // The Observer
    this.wrapObserver = new IntersectionObserver(this.draggingActiveCard.bind(this), this.wrapObserverOptions());

    //Adding the Observer to all the cards
    this.getCards().forEach(card=>{this.wrapObserver.observe(card)})


    // =================== EVENT LISTENERS =====================
    // SRC: https://www.youtube.com/watch?v=YxMtL6lJbZw&list=LL&index=11&t=147s
    if (window.PointerEvent) {
        this.wrapper.addEventListener('pointerdown', this.gestureStart.bind(this));     // using bind to set the "this" to the object and not on the wrapper itself
        this.wrapper.addEventListener('pointermove', this.gestureMove.bind(this));
        this.wrapper.addEventListener('pointerup', this.gestureEnd.bind(this));  
    } else {
        this.wrapper.addEventListener('touchdown', this.gestureStart.bind(this));
        this.wrapper.addEventListener('touchmove', this.gestureMove.bind(this));
        this.wrapper.addEventListener('touchup', this.gestureEnd.bind(this));  
        this.wrapper.addEventListener('mousedown', this.gestureStart.bind(this));
        this.wrapper.addEventListener('mousemove', this.gestureMove.bind(this));
        this.wrapper.addEventListener('mouseup', this.gestureEnd.bind(this));  
    }

    
    // =================== DOTS EVENT LISTENERS =====================
            
    // Click Event for each dot
    this.dots?.forEach((dot, i) => {
        dot.addEventListener('click',(e)=>{
            e.preventDefault();                 // Removing default behaviour
            this.activateDot(i);
            this.setActiveCardExplicitly(i+this.actualCards.length) // setting the cards to actual cards
            clearTimeout(this.timerFn);
            this.moveCardContainerAtInervalFn(this.timerInterval);                         // Restarting the timer after the gap
        })
    })

    // Creating the Hover effect using js coz if not like this it causes problems in mobileview
    this.dots?.forEach((dot, i) => {
        dot.addEventListener('mouseover',(e)=>{
            e.preventDefault();                 
            if (this.mobileView) return
            dot.classList.add(this.dotHoverClass)
        })
    })

    this.dots?.forEach((dot, i) => {
        dot.addEventListener('mouseout',(e)=>{
            e.preventDefault();                 
            if (this.mobileView) return
            dot.classList.remove(this.dotHoverClass);
        })
    })
}



} 
        









// ================================= About Section ========================================

function aboutFn(domEl){
    
    const aboutSliderObj = new sliderObj({
        wrapper: domEl.aboutWrap, 
        cardContainer: domEl.aboutContainer, 
        actualCards: domEl.aboutCards, 
        slideMoveWidth: (mobileView?(domEl.aboutWrap.clientWidth/4.5):(domEl.aboutWrap.clientWidth)/2), 
        defaultInterval:3000, 
        activeCardClassName: 'about-card-active', 
        dotContainer: document.querySelector('.about_dots_container'),
        cardType: 'about',
        dotClass: 'about_dot',
        dotHoverClass: 'about_dot-hover',
        activeDotClass: 'about_dot-active',
        mobileView: mobileView,
        observerMarginDist: mobileView ? (domEl.aboutCards[0].clientWidth/4) : (domEl.aboutCards[0].clientWidth),
    })

    aboutSliderObj.init()
    
}








// ================================= OOP Project Section =======================================

function projectFn(domEl){

    // Project slider object
    const projectSliderObj = new sliderObj({
        wrapper: domEl.projectFrame, 
        cardContainer: domEl.projectSlider, 
        actualCards: domEl.projectSlides, 
        slideMoveWidth: (domEl.projectFrame.clientWidth/2), 
        defaultInterval: 7000, 
        activeCardClassName: 'project-slide-active', 
        dotContainer: document.querySelector('.project_dots_container'),
        cardType: 'project',
        dotClass: 'project_dot',
        dotHoverClass: 'project_dot-hover',
        activeDotClass: 'project_dot-active',
        mobileView: mobileView,
        observerMarginDist: 0,
        cardSetActiveThreshold: 0.4,
        simultaneousChangingElementsArr: [domEl.projectNames,]
    })

    projectSliderObj.init()
    
    // Setting id and dataset values to the project titles programamtically
    const projectNameChanges = (function(){
        const projectNames = document.querySelectorAll(".project-name");
        projectNames.forEach((cur,i)=>{
            cur.id = "project-name-"+i;
            cur.setAttribute('data-project-name',i);
        });
    })()
    
    // CHange the project view by using the details button
    const projectDetailsChangeFn = function(element){  
        // Activating the project details button
        domEl.projectDetailsBtns.forEach((cur)=>cur.classList.remove('project-details-btn-active'));
        element.classList.add('project-details-btn-active');  
        // Activating the correct Project Content in Project Display
        document.querySelectorAll('.project-content').forEach((cur)=>cur.classList.remove('project-content-active'));
        if (element.id==='project-prc') document.querySelectorAll('.project-process').forEach((cur)=>cur.classList.add('project-content-active'));
        else if (element.id==='project-img') document.querySelectorAll('.project-image').forEach((cur)=>cur.classList.add('project-content-active'));
        else if (element.id==='project-lrng') document.querySelectorAll('.project-learning').forEach((cur)=>cur.classList.add('project-content-active'));
    }

    // Moving Project Slides
    const projectChangeActiveSlide = function(element){
        if (element.id === 'project-arrow-left') {
            projectSliderObj.setActiveCardExplicitly(projectSliderObj.activeCardIndex-1);
        } else if (element.id === 'project-arrow-right') {
            projectSliderObj.setActiveCardExplicitly(projectSliderObj.activeCardIndex+1);
        }
    }

    const projectAreaFn = (e) => {
        // Passing target elements bcz closest is already decided otherwise other elements could interrupt capturing the right elements
        if (e.target.closest('.project-arrow')){                                // ARROW CLICKED
            projectChangeActiveSlide(e.target.closest('.project-arrow'));   
        } else if (e.target.closest('.project-details-btn')){                   // PROJECT DETAILS BTN CLICKED
            projectDetailsChangeFn(e.target.closest('.project-details-btn'));
        } else if (e.target.closest('.project-btn')){                           // PROJECT BTN CLICKED
            console.log('A Project btn clicked');
        }
    }

    //Event Listeners for Project Section

    domEl.projectArea.addEventListener('click', projectAreaFn);
    domEl.projectFrame.addEventListener('mouseenter', ()=>{clearTimeout(projectSliderObj.timerFn)});
    domEl.projectFrame.addEventListener('mouseleave', ()=>{projectSliderObj.moveCardContainerAtInervalFn(projectSliderObj.timerInterval)});
   

}




// ================================= Project Section (fucnction Based) =======================================
/*

function projectFn(domEl){
    
    let activeProjectSlide=0;
    let slideExtraWidth = 14;   // the padding margin and borders included in the slide width
    let activeProjectSlidePos=(activeSlideIdx)=>activeSlideIdx*(domEl.projectSlides[activeSlideIdx].offsetWidth + slideExtraWidth); 


    // CHange the project view by using the details button
    const projectDetailsChangeFn = function(element){
        // Activating the project details button
        domEl.projectDetailsBtns.forEach((cur)=>cur.classList.remove('project-details-btn-active'));
        element.classList.add('project-details-btn-active');
        // Activating the correct Project Content in Project Display
        domEl.projectContents.forEach((cur)=>cur.classList.remove('project-content-active'));
        if (element.id==='project-prc') document.querySelectorAll('.project-process').forEach((cur)=>cur.classList.add('project-content-active'));
        else if (element.id==='project-img') document.querySelectorAll('.project-image').forEach((cur)=>cur.classList.add('project-content-active'));
        else if (element.id==='project-lrng') document.querySelectorAll('.project-learning').forEach((cur)=>cur.classList.add('project-content-active'));
    }

    // Moving Project Slides
    const proejctMovementFn = function(element){
        if (element.id === 'project-arrow-left') {
            if (activeProjectSlide>0)activeProjectSlide--; 
            else activeProjectSlide=domEl.projectSlides.length-1;
        } else if (element.id === 'project-arrow-right') {
            if (activeProjectSlide<domEl.projectSlides.length-1) activeProjectSlide++; 
            else activeProjectSlide=0;
        }
        //changing project names
        domEl.projectNames.forEach((cur)=>cur.classList.remove('project-name-active'));
        domEl.projectNames[activeProjectSlide].classList.add('project-name-active');
        // Moving the slider
        domEl.projectSlider.style.transform = `translateX(-${activeProjectSlidePos(activeProjectSlide)}px)`
    
    }

    
    const projectAreaFn = (e) => {
        // Passing target elements bcz closest is already decided otherwise other elements could interrupt capturing the right elements
        if (e.target.closest('.project-arrow')){                                // ARROW CLICKED
            proejctMovementFn(e.target.closest('.project-arrow'));   
        } else if (e.target.closest('.project-details-btn')){                   // PROJECT DETAILS BTN CLICKED
            projectDetailsChangeFn(e.target.closest('.project-details-btn'));
        } else if (e.target.closest('.project-btn')){                           // PROJECT BTN CLICKED
            console.log('A Project btn clicked');
        }
    }

    document.querySelector('.project-name').classList.add('project-name-active')    // Adding the active name class to the first name to show it 
    domEl.projectArea.addEventListener('click', projectAreaFn)
}

*/



// ===============Controller (Combines all page component functions) ======================
let controller = (function(){
    const dom = uiElements.dom;

    // Page Components
    navbarFn(dom);
    
    targetAnchorsFn(dom);

    aboutFn(dom);

    projectFn(dom);
    
})();





// Setting the Page height according to the phone's window in responsive. Solution SOURCE: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vw', `${vw}px`);





















