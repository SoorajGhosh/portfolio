let mobileView, menu=true;


let uiElements = (function(){

    let dom ={
        menuBtn : document.querySelector('.menu-btn'),
        inner : document.querySelector('.inner'),
        nav : document.querySelector('.nav'),
        navLinks : Array.from(document.querySelectorAll('.nav-links')),
        navUl : document.querySelector('.nav-ul'),
        targetBtns : document.querySelectorAll('.target-btn'),
        aboutAnchors:  Array.from(document.querySelectorAll('.about-anchor')),
        aboutWrap: document.querySelector('.about-wrap'),
        aboutContainer: document.querySelector('.about-container'),
        aboutSection: document.querySelector('.about'),
        aboutCards: Array.from(document.querySelectorAll('.about-card')),
    }

    // Showing/Removing the NAV
    const showNav = function(){
        dom.inner.classList.toggle('inner-hidden');
        dom.navLinks.map((cur)=>cur.classList.toggle('nav-links-show'))
        dom.navUl.classList.toggle('nav-ul-center');
        dom.menuBtn.classList.toggle('menu-btn-click');
    }

    return {dom,showNav}
})(); 



let controller = (function(){
    const dom = uiElements.dom;

    function test(){console.log('Cleared');}
    
    // Event Listeners
    dom.menuBtn.addEventListener('click', uiElements.showNav);
    
    // NAVBAR
    dom.nav.addEventListener('click', function(e){
        e.preventDefault();
        const section_id = e.target.closest('.nav-target')?.getAttribute('href');
        if (!section_id) return;
        (section_id!=='#intro-section') ? uiElements.showNav():undefined;
        document.querySelector(section_id).scrollIntoView({behavior:'smooth'});
    });

    // In between links to go somewhere on the page
    dom.targetBtns.forEach((cur)=>cur.addEventListener('click', function(e){
        e.preventDefault();
        const sectionID = e.target.getAttribute('href')
        document.querySelector(sectionID).scrollIntoView({behavior:'smooth'});
    }));

    //=============ABOUT===========================
    dom.aboutSection.addEventListener('click', function(e){
        e.preventDefault();
        const active_card_id = e.target.closest('.about-anchor')?.getAttribute('href');
        if (!active_card_id) return;
        console.log(active_card_id);
        document.querySelector(active_card_id).scrollIntoView({behavior:'smooth'});
    })

    // dom.aboutContainer.addEventListener('scroll',function(){
    //     console.log('scrolled');
    // })

    //creating clones of ABout container
    let nextAboutContainer=[], prevAboutContainer=[];
    dom.aboutCards.forEach((cur,i,arr)=>{
        nextAboutContainer.push(dom.aboutCards[i].cloneNode(true));
        prevAboutContainer.unshift(dom.aboutCards[i].cloneNode(true));
    })
    // console.log(prevAboutContainer, nextAboutContainer);
    
    
})();

// Setting the Page height according to the phone's window in responsive. Solution SOURCE: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vw', `${vw}px`);



(function responsive(){
    let media = window.matchMedia("(max-width: 600px)")

    let checkMedia = mediaQuery => {
        mobileView = mediaQuery.matches;
        return mobileView;
    }

    checkMedia(media);

    media.addListener(checkMedia)
})();











































