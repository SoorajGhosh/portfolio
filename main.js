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
    
    // ============ Infinite Scrolling of cards ================
    
    // Only for mobile view the observer is going to be work
    if (mobileView){

        function aboutCardIntersectionFn(entries){
            const [entry] = entries;
    
            // Add or remove the active card class depedning on if its intersecting (entering) or not (exiting)
            if (entry.isIntersecting===true){
                entry.target.classList.add("about-card-active");
                const id = entry.target.id.split('-')[2];              // Getting the Id number fo slide
                activateDot(id);
            } else {
                entry.target.classList.remove("about-card-active")
            }
        }

        // About Card Observer
        var aboutContainerObserver = new IntersectionObserver(aboutCardIntersectionFn, {root: domEl.aboutContainer, threshold:1, rootMargin:'0px'});
        domEl.aboutCards.forEach(function(card){
            aboutContainerObserver.observe(card);
        })
    }
        
    

    //=============ABOUT===========================
    // domEl.aboutSection.addEventListener('click', function(e){
    //     e.preventDefault();
    //     const active_card_id = e.target.closest('.about_dot')?.getAttribute('href');
    //     if (!active_card_id) return;
    //     console.log(active_card_id);
    //     document.querySelector(active_card_id).scrollIntoView({behavior:'smooth'});
    // })

    //creating clones of ABout container
    // let nextAboutContainer=[], prevAboutContainer=[];
    // domEl.aboutCards.forEach((cur,i,arr)=>{
    //     nextAboutContainer.push(domEl.aboutCards[i].cloneNode(true));
    //     prevAboutContainer.unshift(domEl.aboutCards[i].cloneNode(true));
    // })

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












































