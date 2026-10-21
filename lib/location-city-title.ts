// Fluid mobile title scale shared by the How It Works section titles and the city
// waitlist page. 50px on every phone from ~340px up; below that the cap eases it
// so the widest title ("Skills Challenges", ~6.1em) still fits on one line.
// The Locations list does not use this: its title shares the row with the button.
export const cityTitleMobileClassName =
  "text-[min(3.125rem,calc((100vw-2rem)/6.2))] leading-[0.84]";
