#imgurapp
an application for browsing images (porn, or cats) from imgur, contains a list of different subreddits to browse through.
has few bugs on view transitioning and swiping.

###quirks
* swiping when loading causes the app to die
* scrolling occasionally works at double speed (due to overflow scroll rubberband and transform running in same time)
* rapidly doing random things sometimes leads to random occurrences of random things
* tested only on iphone 5
* does not work correctly on desktops (iphone5 emulation on chrome should be ok, apart from occasional flickering in new chrome..)

##dev requirements
`npm`, `gulp`, `bower`

##installation
`npm install` & `bower install` -> `gulp serve`

##building
`gulp` creates a dist folder of compiled things

###using
select gallery from the list in frontpage

on gallery view
* swipe left -> next gallery
* swipe right -> prev gallery
* swipe up -> back to main
* tap on image show

on image view
* swipe left -> next image in gallery
* swipe right -> prev image in gallery
* swipe up -> back to gallery

two finger swipe up goes back without scrolling to the top first.

###license
all rights reserved.
