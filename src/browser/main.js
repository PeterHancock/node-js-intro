var http = require('browser-http');
var $ = require('jquery');
var querystring = require('querystring');
var renderSlides = require('../render-slides');
var terminal = require('./terminal')('/terminal');


var slideShow;
var slides = {};
var activeSlide;
var terminals = {};
var terminalTransparency = 0.5;
var terminalSupported = false;

$('<span class="terminal-container" tabindex="-1"></span>').appendTo('body');

terminal.on('open', function () {
    terminalSupported = true;
    $('.terminal-container').show();
});

getSlidesMarkdown()
// Then place the slides markdown where remark expects and start remark
    .then(function (slidesMd) {
        $('#source').text(slidesMd);
        slideShow = window.slideShow = remark.create({
            highlightStyle: 'monokai',
            highlightLanguage: 'remark'
        });
        return slideShow;
    })
    .then(setupSlideShow)
    .catch(function (err) { // Oh, here again :-)
        console.error(err);
    });

function getSlidesMarkdown() {
    if (querystring.parse(global.location.search.substring(1)).dev) {
        // Load the slides template - A mustache template in a markdown format
        function urlResolver(url, callback) {
            http.get(url)
                .then(function (response) {
                    callback(null, response.data);
                });
        }
        return http.get('slides.tmpl.md')
        // load and render any code snippets etc
        .then(function (response) {
            return renderSlides(response.data, urlResolver);
        });
    } else {
        return http.get('static/slides.md').then(function (response) {
            return response.data;
        });
    }
}


function setupSlideShow(slideShow) {
    slideShow.on('afterShowSlide', function (slide) {
        onAfterShowSlide(slide.number);
    });

    slideShow.on('hideSlide', function (slide) {
        $('.terminal-container').empty().off('click').hide();
    });

    function addTerminalKeyHandler(event, method) {
        window.addEventListener(event, function(ev) {
            if (activeSlide.terminal && activeSlide.terminalMode && activeSlide.terminalFocus) {
                activeSlide.terminal.terminal[method](ev);
            }
        });
    }

    addTerminalKeyHandler('keydown', 'keyDown');
    addTerminalKeyHandler('keypress', 'keyPress');

    window.addEventListener('keypress', function(event) {
        if (!activeSlide.terminalFocus) {
            handleKeyPress(event);
        }
    });

    //Handle page refresh
    onAfterShowSlide(slideShow.getCurrentSlideNo());
}

function onAfterShowSlide(slideNo) {
    var idx = slideNo - 1;
    activeSlide = slides[idx];
    if (!activeSlide) {
        activeSlide = setupSlide(idx);
    }
    if (activeSlide.terminal) {
        attachTerminal(activeSlide);
    }
}

function setupSlide(idx) {
    var activeSlide = slides[idx] = {};
    var terminalConfig = $('.remark-visible .add-terminal')[0]; //One terminal per slide
    if (terminalConfig) {
        $('.remark-visible .add-terminal').remove();
        terminalConfig = JSON.parse($(terminalConfig).text());
        if (terminalConfig.name) {
             activeSlide.terminal = terminals[terminalConfig.name] = terminals[terminalConfig.name] || terminal.create(terminalConfig);
         } else {
            activeSlide.terminal = terminal.create(terminalConfig);
        }
    }
    return activeSlide;
}

function attachTerminal(activeSlide) {
    var container = '.terminal-container';
    var button = $('<div class="term-button">>_</div>')
            .appendTo(container);
    var term = $('<div class="term"></div>')
            .appendTo(container);
    adjustTerminalTransparency();
    activeSlide.terminal.appendTo('.term');
    if (activeSlide.terminalMode) {
        term.show();
        button.hide();
    } else {
        term.hide();
        button.show();
    }
    $(container)
        .click(function(event) {
            if (activeSlide.terminalMode && !event.ctrlKey) {
                return;
            }
            if (activeSlide.terminalMode) {
                term.hide();
                button.show();
                try {
                    slideShow.resume();
                } catch (e) {/* remarkjs bug */ }
            } else {
                slideShow.pause();
                term.show();
                button.hide();
            }
            activeSlide.terminalMode = !activeSlide.terminalMode;
            activeSlide.terminalFocus = activeSlide.terminalMode;
        })
        .focus(function () {
            activeSlide.terminalFocus = activeSlide.terminalMode;
        })
        .blur(function () {
            activeSlide.terminalFocus = false;
        });

        if (terminalSupported) {
            $(container).show();
        }
}

function handleKeyPress(event) {
    switch (event.keyCode) {
        case 45: 
            terminalTransparency = Math.max(0, terminalTransparency - 0.05);
            break;
        case 61:
            terminalTransparency = Math.min(1, terminalTransparency + 0.05);
    }
    adjustTerminalTransparency();
    console.log(event);
}

function adjustTerminalTransparency() {
    $('.term, .term-button').css('background-color', 'rgba(0, 0, 0, ' + terminalTransparency + ')');
};
