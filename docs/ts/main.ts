$('.viewport').scroll(function () {
    let scrollTop = $(document).scrollTop() + $(window).height() / 2;
    scrollTop *= 0.9
    let anchors = $('body').find('section');

    console.log("scroll", scrollTop)

    let getPosition = (anchor: HTMLElement) => $(anchor).offset().top + $(anchor).height() / 2
    let getDistance = (anchor: HTMLElement) => Math.abs(scrollTop - getPosition(anchor))

    let nearestAnchor = anchors.get()
        .reduce((nearestAnchor = anchors[1], otherAnchor) => (getDistance(nearestAnchor) < getDistance(otherAnchor) ? nearestAnchor : otherAnchor))


    anchors.get().forEach(anchor => {
        if (anchor == nearestAnchor) {
            $('nav div div a[href="#' + $(anchor).attr('id') + '"]').addClass('active');
        } else {
            $('nav div div a[href="#' + $(anchor).attr('id') + '"]').removeClass('active');
        }
    })

});


let charPause: Interval = { from: 50, to: 150 }
let enterPause: Interval = { from: 1000, to: 1000 }
let removePause: Interval = { from: 1000, to: 4000 }

const startTyping = ({ textId, cursorId, text = "", repetitionNumber = Infinity }: { textId: string; cursorId: string; text?: string; repetitionNumber?: number; }) => {
    return new Promise(async resolver => {
        let element = document.getElementById(textId);
        let remainingChars = text.split('')

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

        console.log("resolve1");
        await enterText()
        console.log("resolver2");
        while (repetitionNumber--) {
            console.log("rep")
            await removeText()
            await enterText()
        }

        console.log("resolve3");
        resolver();
    })
}

let getRandomWaitTime = (interval: Interval): number => {
    return Math.random() * (interval.to - interval.from) + interval.from;
}

startTyping({ textId: "dev_text", cursorId: "dev_cursor", text: "I'm Benedek.", repetitionNumber: 0 })
    .finally(() => {
        document.getElementById("top").scrollIntoView();
    })
startTyping({ textId: "dev_text_2", cursorId: "dev_cursor_2", text: "", repetitionNumber: 0 })