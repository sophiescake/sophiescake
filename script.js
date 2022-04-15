function wrapLettersInSpan(className) {
    console.log("Every word into span");

    var textWrapper = document.querySelectorAll(className);
    
    if (textWrapper != null) {
        textWrapper.forEach(element => {
            console.log("Converting " + className + " sentences into letters captured by span");
            element.innerHTML = element.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        });
    }
}

function animate(textClass, emojiClass, animDelay=0) {
    runningAnimIn0 = anime.timeline({
        loop: false
    })
    .add({
        targets: textClass,
        opacity: 1,
        easing: "easeInOutQuad",
        duration: 1,
        delay: animDelay
    })
    .add({
        targets: textClass + ' .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 1500,
        delay: (el, i) => 30 * (i+1)
    });

    runningAnimIn1 = anime({
        targets: emojiClass,
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 400,
        delay: 1300 + animDelay
    })
}

function animateOut() {
    // Stop all running animations first
    runningAnimIn0.pause();
    runningAnimIn1.pause();
    runningAnimOut0.pause();
    runningAnimOut1.pause();


    runningAnimOut0 = anime.timeline({
        loop: false,
        complete: function(anim) {
            if (anim.began && anim.completed) {
                let content = getNextContent();
                changeTextContent("slide-text", content);
                wrapLettersInSpan('.slide-text');
                changeEmojiContentRandom('emoji');
                animate('.slide-text', '.emoji');
            }
        },
    })
    .add({
        targets: '.slide-text',
        opacity: 0,
        duration: 500,
        easing: "easeOutExpo",
        delay: 50
    });

    runningAnimOut0 = anime({
        targets: '.emoji',
        opacity: 0,
        easing: "easeInOutQuad",
        duration: 100,
        delay: 300
    });
}

function animateButton() {
    anime({
        targets: '#magic-button',
        scale: [1, 0.7, 1.3, 1],
        easing: "easeInOutQuad",
        duration: 300,
    })
}

function changeTextContent(className, content) {
    const textEl = document.getElementsByClassName(className);
    textEl[0].innerHTML = content;
}

function changeEmojiContentRandom(emojiClass) {
    const emoj = document.getElementsByClassName(emojiClass);
    emoj[0].innerHTML = emojis[getRandomIndex(emojis)];
}

function getRandomIndex(arr) {
    return Math.floor(Math.random()*arr.length);
}

function getNextContent() {

    console.log("Next content: " + contentIdx);

    // Fill array indices again if all elements are already shown
    if (contentIdx.length == 0) {
        contentIdx = Array.from(Array(contentText.length).keys());
    }

    // Get random index from content indices and delete from array (no duplicate show)
    let randomIdx = getRandomIndex(contentIdx);
    let content = contentText[contentIdx[randomIdx]];
    contentIdx.splice(randomIdx, 1); // 2nd parameter means remove one item only

    // Return content
    return content;
}

function showDaily() {
    // Show daily
    changeTextContent("title-text", "Daily " + getDailyIndex());
    wrapLettersInSpan(".title-text");
    
    changeTextContent("daily-text", dailyText[getDailyIndexMod()]);
    wrapLettersInSpan(".daily-text");
    animate('.title-text', '', 500);

    changeEmojiContentRandom("daily-emoji")
    animate('.daily-text', '.daily-emoji', 1100);
}

// ========================
// MAIN
// ========================
$(document).ready(function () {
    console.log("Document ready!");

    // Get the content from .txt files
    fetch('gentle_reminders_polished.txt')
        .then(response => response.text())
        .then(text => {
            contentText = text.split(/\r?\n/);
            showDaily();
            // console.log(contentText)
        });

    fetch('dailies_polished.txt')
        .then(response => response.text())
        .then(text => {
            dailyText = text.split(/\r?\n/);
            showDaily();
            // console.log(dailyText)
        });

    const btn = document.getElementById('magic-button');
    btn.onclick = function(){
        animateOut();
        animateButton();
    };
    
    // FOR YOU
    // This text can be changed when button is pressed (animate out calls animate again)
    wrapLettersInSpan(".slide-text");
    animate('.slide-text', '.emoji', 4500); // animate for you section

    // Show quote section for you background
    anime({
        targets: '.quote-section-for-you',
        opacity: 1,
        duration: 400,
        easing: "easeOutExpo",
        delay: 4000
    });

    // Show title for you
    wrapLettersInSpan(".slide-title-text");
    animate('.slide-title-text', '', 4200);

    // Show magic button with delay
    anime({
        targets: '#magic-button',
        opacity: 1,
        duration: 500,
        easing: "easeOutExpo",
        delay: 6000
    });

});

function getDayFromMs(ms) {
    return Math.floor(ms / 1000 / 60 / 60 / 24);
}

function getDailyIndex() {
    let startDate = new Date("April 14, 2022");
    let msDiff = Date.now() - startDate.getTime();
    return getDayFromMs(msDiff);
}

function getDailyIndexMod() {
    return getDailyIndex() % dailyText.length;
}

// ========================
// Media queries to save attributes that change on window size
// ========================
// var mediaQueryList = window.matchMedia('(max-width: 770px)');
// mediaQueryList.onchange = (e) => {
//     if (e.matches) {
//         /* the viewport is 770px pixels wide or less */
//     } else {
//         /* the viewport is more than than 770px pixels wide */
//     }
// };

// ========================
// GLOBALS
// ========================
var runningAnimIn0 = anime({});
var runningAnimIn1 = anime({});

var runningAnimOut0 = anime({});
var runningAnimOut1 = anime({});

var contentText = [];
var dailyText = [];

var contentIdx = Array.from(Array(contentText.length).keys());

var emojis = [
    '✨',
    '❤️',
    '❣️',
    '💝',
    '👸🏻',
    '🐨',
    '💖',
    '🍀',
    '😇',
    '💗',
    '🙊',
    '🙏🏽',
    '☀️'
];
