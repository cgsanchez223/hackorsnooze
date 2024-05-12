"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


// submit form in nav bar
function navSubmit(e) {
  console.debug("navSubmit", e);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmit);


// favorites page in nav bar
function navFavorites(e) {
  console.debug("navFavorites", e);
  hidePageComponents();
  userFavorites();
}

$body.on("click", "#nav-favorites", navFavorites);


// stories page on nav bar
function navMyStories(e) {
  console.debug("navMyStories", e);
  hidePageComponents();
  saveUserStory();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);



/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide(); // added
}

$navLogin.on("click", navLoginClick);


// profile page on nav bar
function navProfile(e) {
  console.debug("navProfile", e);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfile);



/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  // $(".main-nav-links").show();
  $(".main-nav-links").css('display', 'flex');
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
