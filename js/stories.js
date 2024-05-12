"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}


/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
// adding a delete button to add/remove from favorite list
function generateStoryMarkup(story, deleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const starIcon = Boolean(currentUser); // starIcon will show a star symbol if on favorites

  return $(`
      <li id="${story.storyId}">
      <div>
        ${deleteButton ? getDeleteBtn() : ""}
        ${starIcon ? getStarBtn(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

// Delete button - fas fa-trash-alt generates trashcan image
function getDeleteBtn() {
  return `
        <span class="trash-can">
          <i class="fas fa-trash-alt"></i>
          </span>`;
}

// Toggle button star icon for favorites - fas is on, far is off
function getStarBtn(story, user) {
  const onFavoritesList = user.onFavoritesList(story);
  const starImage = onFavoritesList ? "fas" : "far";
  return `
        <span class="star">
          <i class="${starImage} fa-star"></i>
        </span>`;
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


// removeStory - when you click trash can to remove story
async function removeStory(e) {
  console.debug("removeStory");

  // after removing a story, next list moves up
  const $newList = $(e.target).closest("li"); // closest parent to a class
  const storyId = $newList.attr("id"); // gets value of current element

  await storyList.deleteStory(currentUser, storyId);

  await saveUserStory();
}

$ownStories.on("click", ".trash-can", removeStory);

// newStory - when you submit a new story in the form
async function newStory(e) {
  console.debug("newStory");
  e.preventDefault();

  const title = $("#submitTitle").val();
  const url = $("#submitURL").val();
  const author = $("#submitAuthor").val();
  const username = currentUser.username
  const storyData = { title, url, author, username }; // collect info from 4 above

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow"); // hides selected item
  $submitForm.trigger("reset"); // keeps order
}

$submitForm.on("submit", newStory);

// saveUserStory - for the tab for user's stories
function saveUserStory() {
  console.debug("saveUserStory");
  
  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("No stories added"); // If nothing added to page
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    } // generate HTML of users stories
  }

  $ownStories.show();
}


// for the tabs for users' favorites
function userFavorites() {
  console.debug("userFavorites");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("No favorites added"); // If nothing is added to favorites
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    } // generate HTML of user favorites
  }

  $favoritedStories.show();
}

// toggle between favorite and unfavorite
async function toggleFavorite(e) {
  console.debug("toggleFavorite");

  const $target = $(e.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);


  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far"); // if it is favorited
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavorite);