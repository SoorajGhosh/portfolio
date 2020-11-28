let mobileView, menu=true;


let uiElements = (function(){

    let dom ={
        menuBtn : document.querySelector('.menu-btn'),
        inner : document.querySelector('.inner'),
        nav : document.querySelector('.nav'),
        navLinks : Array.from(document.querySelectorAll('.nav-links')),
        navUl : document.querySelector('.nav-ul'),
    }

    //The inner element slides down in mobile view
    const innerDive = function(){
        if (menu){
            dom.inner.classList.add('inner-hidden');
            dom.navLinks.map((cur)=>cur.classList.add('nav-links-show'))
            dom.navUl.classList.add('nav-ul-center');
            dom.menuBtn.classList.add('menu-btn-click');
            menu=false;
        } else {
            dom.inner.classList.remove('inner-hidden');
            dom.navLinks.map((cur)=>cur.classList.remove('nav-links-show'))
            dom.navUl.classList.remove('nav-ul-center');
            dom.menuBtn.classList.remove('menu-btn-click');
            menu=true;
        }
    }

    return {dom,innerDive}
})(); 



let controller = (function(){
    const dom = uiElements.dom;

    function test(){console.log('Cleared');}
    
    // Event Listeners
    dom.menuBtn.addEventListener('click', uiElements.innerDive);
    
})();





(function responsive(){
    let media = window.matchMedia("(max-width: 600px)")

    let checkMedia = mediaQuery => {
        mobileView = mediaQuery.matches;
        return mobileView;
    }

    checkMedia(media);

    media.addListener(checkMedia)
})();











































