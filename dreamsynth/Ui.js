// UI
var muteButton = document.getElementById('muteButton');
var toggleMute = function (ev) {
    var isMuted = Tone.Master.mute = !Tone.Master.mute;
    if (isMuted) {
        document.body.className += ' muted';
    } else {
        document.body.className = document.body.className.replace(' muted', '');
    }
};
muteButton.addEventListener('click', toggleMute);

// start muted so they have to click which will start the audio context
toggleMute();

var isIntroClosed = false,
    onStartedListeners = [],
    addOnStartedListener = function(listener) {
        onStartedListeners.push(listener);
    },
    intro = document.getElementById('intro'),
    startButton = document.getElementById('startButton');
var onLoaded = function(ev) {
    intro.className += ' closed';
    setTimeout(function () { intro.style.display = 'none'; }, 350);

    isIntroClosed = true;

    setTimeout(function() {
            onStartedListeners.forEach(function(listener) {
                listener();
            });
            onStartedListeners = null;
        }, 100);
};

startButton.disabled = true;
startButton.innerText = "Loading...";

var numItemsLoading = 0,
    incrementLoadingItems = function() {
        numItemsLoading++;
    },
    decrementLoadingItems = function() {
        if (--numItemsLoading == 0) {
            document.body.className = document.body.className.replace('loading', 'loaded');
            
            onLoaded();
        }
    };

StartAudioContext(Tone.context, muteButton, function() {debugPrint('auto started')});
