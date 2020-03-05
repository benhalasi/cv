

$(window).scroll(function () {
    var scrollTop = $(document).scrollTop() + $(window).height() / 2;
    var anchors = $('body').find('section');

    for (var i = 0; i < anchors.length; i++) {
        if (scrollTop > $(anchors[i]).offset().top && scrollTop < $(anchors[i]).offset().top + $(anchors[i]).height()) {
            $('nav div div a[href="#' + $(anchors[i]).attr('id') + '"]').addClass('active');
        } else {
            $('nav div div a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('active');
        }
    }
});


let charPause: Interval = { from: 50, to: 150 }
let enterPause: Interval = { from: 4000, to: 8000 }
let removePause: Interval = { from: 1000, to: 4000 }

const startTyping = async ({ textId, cursorId, text = "", repetitionNumber = Infinity }: { textId: string; cursorId: string; text?: string; repetitionNumber?: number; }) => {
    let element = document.getElementById(textId);
    let remainingChars = text.split('')//.reverse();

    let cursor = new Cursor(cursorId)

    let enterText = (): Promise<void> => {
        return new Promise(async (resolver) => {
            while (remainingChars.length) {
                await enterChar(remainingChars.splice(0, 1)[0])
            }
            setTimeout(resolver.bind(this), getRandomWaitTime(enterPause))
        });

    }

    let enterChar = (char: string): Promise<void> => {
        return new Promise(resolver => {
            element.innerText += char
            setTimeout(resolver.bind(this), getRandomWaitTime(charPause))

            cursor.hasMovedHook()
        });
    }

    let removeText = (): Promise<void> => {
        return new Promise(async (resolver) => {
            if (element.innerText.length) {
                await removeChar(400)
            }
            while (element.innerText.length) {
                await removeChar(40)
            }
            remainingChars.reverse()
            setTimeout(resolver.bind(this), getRandomWaitTime(removePause))
        });

    }

    let removeChar = (waitTime = getRandomWaitTime(charPause)): Promise<void> => {
        return new Promise(resolver => {
            let innerText = element.innerText
            let length = innerText.length

            remainingChars.push(innerText.substring(length - 1, length))
            element.innerText = element.innerText.substring(0, length - 1)
            setTimeout(resolver.bind(this), waitTime)

            cursor.hasMovedHook()
        });
    }

    await enterText()
    while (repetitionNumber--) {
        await removeText()
        await enterText()
    }

}

let getRandomWaitTime = (interval: Interval): number => {
    return Math.random() * (interval.to - interval.from) + interval.from;
}

startTyping({ textId: "dev_text", cursorId: "dev_cursor", text: "I'm Benedek.", repetitionNumber: 0 })
startTyping({ textId: "dev_text_2", cursorId: "dev_cursor_2", text: "", repetitionNumber: 0 })
CSS.paintWorklet.addModule('js/paint.js'); 
