const myName = "Dev nirmal shah";
const h1 = document.querySelector(".heading-primary");
console.log(myName);
console.log(h1);
//setting current year
const yearEL = document.querySelector('.year');
const currentYear = new Date().getFullYear();
yearEL.textContent = currentYear;
const navBarEL = document.querySelector(".btn-mobile-nav");
const headerEL = document.querySelector(".header");
navBarEL.addEventListener("click", function(){
    headerEL.classList.toggle("nav-open");
})
// Select all links
const allLinks = document.querySelectorAll('a:link');

// Loop through each link
allLinks.forEach(function(link) {
  link.addEventListener("click", function(e) {
    // Prevent default behavior
    e.preventDefault();

    // Get the href attribute value
    const href = link.getAttribute("href");

    // Close the mobile navigation if the link belongs to the main nav
    if (link.classList.contains('main-nav-link')) {
      const headerEl = document.querySelector('header');
      headerEl.classList.toggle("nav-open");
    }

    // Scroll to the section
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/////////////////////////////////////////////////
// sticky navigation
//////////////////////////////////////////////
const sectionHeroEl = document.querySelector('.section-hero');
//Obsever is to observe if something enters or passthrough
//passing and array named entries
const obs = new IntersectionObserver(function(entries){
// Entries has only one element
 const ent = entries[0];
 //intersecction state
 
 // checking if isIntersecting
 if(ent.isIntersecting == false){
     //intersecction state
    console.log(ent);
    document.body.classList.add("sticky");
 }
 if(ent.isIntersecting == true){
    // Removal of intersection state
   console.log(ent);
   document.body.classList.remove("sticky");
}
},{
    //in a viewport
    root:null,
    threshold:0,
    rootMargin: "-80px"

});
obs.observe(sectionHeroEl);