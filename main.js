let mobileView, menu=true;


let uiElements = (function(){

    let dom ={
        menuBtn : document.querySelector('.menu-btn'),
        inner : document.querySelector('.inner'),
        nav : document.querySelector('.nav'),
        navLinks : Array.from(document.querySelectorAll('.nav-links')),
        navUl : document.querySelector('.nav-ul'),
        targetBtns : document.querySelectorAll('.target-btn')
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
    dom.nav.addEventListener('click', function(e){
        e.preventDefault();
        const section = e.target.closest('.nav-target');
        if (!section) return;
        uiElements.showNav();
        const sectionID = section.getAttribute('href')
        document.querySelector(sectionID).scrollIntoView({behavior:'smooth'});
    });
    dom.targetBtns.forEach((cur)=>cur.addEventListener('click', function(e){
        e.preventDefault();
        const sectionID = e.target.getAttribute('href')
        document.querySelector(sectionID).scrollIntoView({behavior:'smooth'});
    }))

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











































