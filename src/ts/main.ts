import { Cursor } from "./Cursor"
import { Interval } from "./Interval"

$('.viewport').scroll(() => {
    let scrollTop = $(document).scrollTop() + $(window).height() / 2;
    scrollTop *= 0.9
    let anchors = $('body').find('section');

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
let enterPause: Interval = { from: 200, to: 200 }
let removePause: Interval = { from: 1000, to: 4000 }

const startTyping = ({ textId, cursorId, text = "", repetitionNumber = Infinity }: { textId: string; cursorId: string; text?: string; repetitionNumber?: number; }): Promise<void> => {
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

        await enterText()
        while (repetitionNumber--) {
            await removeText()
            await enterText()
        }

        resolver();
    })
}

let getRandomWaitTime = (interval: Interval): number => {
    return Math.random() * (interval.to - interval.from) + interval.from;
}

$(startTyping({ textId: "dev_text", cursorId: "dev_cursor", text: "I'm Benedek.", repetitionNumber: 0 })
    .then(() => {
        $('#overlay').animate({
            height: '0%'
        }, 800)
    }))

