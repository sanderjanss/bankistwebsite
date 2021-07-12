'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');


//Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');




///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// Button scrolling
btnScrollto.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect())

  section1.scrollIntoView({
    behavior:'smooth'
  })
})

/////////////////////////////////////////////////////////////
//Page navigation

//BAD PRACTICE FOR IF YOU HAVE MANY LINKS
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth'
//     })
//   })
// })

// 1. Add event listener to common parent element.
// 2. Determine what element originated the event.



navLinks.addEventListener('click', function(e){
  
  //Matching strategy
  if(e.target.classList.contains('nav__link')){
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    })
  }
})



tabsContainer.addEventListener('click', function(e){
  //closest finds the closest parent with this classname (operations__tab)
  //if there are no other children to click u can use classlist.contains
  const clicked = e.target.closest('.operations__tab');
  //Guard clause
  if(!clicked) return;
  //remove the class of the active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active');

  const id = clicked.getAttribute('data-tab')
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))
  document.querySelector(`.operations__content--${id}`).classList.add('operations__content--active')
})

//Menu fade animation
const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(s => {
      if(s != link){
        s.style.opacity = this;
      }
      logo.style.opacity = this;
    })
  }
}

//Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5))

nav.addEventListener('mouseout', handleHover.bind(1))



////Sticky Navigation: Old School, not good for performance
//const initialCoords = section1.getBoundingClientRect()
// window.addEventListener('scroll', function(){
//   if(window.scrollY > initialCoords.top) 
//   nav.classList.add('sticky')
//   else nav.classList.remove('sticky');
// })

//Sticky navigation: Intersection Observer API, better for performance
//This API allows our code to observe changes to the way a certain target element intersects another element, or it intersects the viewport

// const obsCallback = function(entries, observer){
//   entries.forEach(entry => {
//     console.log(entry)
//   })
// }

// const obsOptions = {
//   root: null,
//   treshold: [0, 0.2,], 
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver
(stickyNav, {root: null, threshold: 0, rootMargin: `-${navHeight}px`});
headerObserver.observe(header);


// Reveal sections: Intersection Observer API
const allSections = document.querySelectorAll('.section')

const revealSection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver
(revealSection, {
  root: null,
  threshold: 0.15

})
allSections.forEach(function(section){
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

// Lazy Loading images: Intersection Observer API

const imgTargets = document.querySelectorAll('img[data-src]')


const loadImage = function(entries, observer){
  const [entry] = entries;
  console.log(entry);

  if(!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target)
};

const imgObserver = new IntersectionObserver
(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => imgObserver.observe(img))

//Slider
const slider = function(){
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;


//Slider Functions
const createDots = function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend', 
    `<button class="dots__dot" data-slide="${i}"></button>`);
  })
}

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot')
  .forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

const goToSlide = function(slide){
  slides.forEach((s, i) => s.style.transform =
`translateX(${100 * (i - slide)}%)`)

}

//Next slide
const nextSlide = function(){
  if(curSlide === maxSlide - 1){
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

//Previous slide
const prevSlide = function(){
  if(curSlide === 0){
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

const init = function(){
  createDots();
  activateDot(0);
  goToSlide(0);
}

init();

//Eventhandlers
btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight'){
    nextSlide();
  } else if (e.key === 'ArrowLeft'){
    prevSlide();
  }
});

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
   const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }

})
}
slider();

////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

//PRACTICE CODE

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// //queryselectorAll creates a nodelist, it resembles an array but doesnt have all the same functionality
// const allSections = document.querySelectorAll('.section');
// console.log(allSections)

// document.getElementById('section--1');

// //all the elements with the name of button gets looked up and return a HTMLCollection
// //When the DOM changes this collection get updated automaticly, the same does not happen with a nodelist
// const allButtons = document.getElementsByTagName('button');

// console.log(allButtons);

// //will also return a live HTMLCollection
// document.getElementsByClassName('btn');

//CREATING AND INSERTING ELEMENTS
// .insertAdjacentHTML

// //creates a dom element and stores it in a message
// //if we want it in the page, we need to manually insert it
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// //message.textContent('We use cookies for improved functionality and analytics.')
// message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--class-cookie">Got it!<!button>'

//a dom element is unique, its a live element that can only be at one place at a time
//we first prepended it as first child, and it got moved to last child by append
//header.prepend(message);

// header.append(message);

//you can actually clone it to get it twice
//header.append(message.cloneNode(true));

//with before and after you can replace the element in the dom
//header.before(message);
//header.after(message);

//DELETING ELEMENTS

// const cookieBTN = document.querySelector('.btn--class-cookie');

// cookieBTN.addEventListener('click', function(){
//   message.remove();
// })

//STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(getComputedStyle(message).color)

// message.style.height = Number.parseFloat(getComputedStyle(message).heigth, 10) + 30 +'px';
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// //only works with standard attributes
// console.log(logo.alt)
// console.log(logo.src)
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// //DATA ATTRIBUTES
// console.log(logo.dataset.versionNumber)

//CLASSES
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();


// const btnScrollto = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollto.addEventListener('click', function(e){
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   console.log(e.target.getBoundingClientRect())


//   //OLD SCHOOL WAYS of Scrolling
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset, 
//   //   s1coords.top + window.pageYOffset
//   // );
//   //scrolling with passing in an object instead of arguments
//   //this way u can specify behavior
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset, 
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',

//   // })

//   //MODERN WAY of Scrolling (only for newest browsers)
//   section1.scrollIntoView({
//     behavior:'smooth'
//   })
// })

// const h1 = document.querySelector('h1');

// const alerth1 = function(e){
//   alert('addEventListener')

//   h1.removeEventListener('mouseenter', alerth1);
// }

// h1.addEventListener('mouseenter', alerth1)

////OLD WAY of listening to events
// h1.onmouseenter = function(e){
//   alert('addEventListener')
// }

// // rgb(255, 255, 255)
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
// const randomColor = () => `rgb(${randomInt(0,255)}, ${randomInt(0,255)}, ${randomInt(0,255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();

//   //stop propagation, in general not a good idea to stop propagation
//   //e.stopPropagation();
// })
// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();

// })
// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();

// })


// const h1 = document.querySelector('h1');

// //GOING DOWNWARDS: child
// //querySelector works also on elements, not only on document
// //querySelectorAll creating a nodeList
// console.log(h1.querySelectorAll('.highlight'))
// //gives a NodeList, and anything can be a node
// console.log(h1.childNodes);
// //gives you a HTMLCollection, its a live collection, its updated, 3 elements that are inside, only for direct children
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //GOING UPWARDS: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //closest is the opposite of queryselector, they both receive a query string
// //as an input, but queryselector finds children no matter how deep in the dom tree,
// //while closest finds parents, no matter how far up in the dom tree
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// //GOING SIDEWAYS: siblings
// //in js u can only connect direct siblings, so previous and the next one
// console.log(h1.previousElementSibling)
// console.log(h1.nextElementSibling)

// //for nodes
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //for all the siblings, we can move up to the parent element, and read all the children from there

// console.log(h1.parentElement.children)

  