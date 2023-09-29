/*
* Authors: Rúni, Julia
* */

(function(){
    const editorDiv = document.querySelector('div.ql-editor')

    if(editorDiv) {
        smartlink(editorDiv)
    }

    function smartlink(editorDiv) {
        const originalHtml = editorDiv.innerHTML
        const formActions = editorDiv.closest('form').querySelector('.form-actions')

        // Insert SmartButton before last child in formActions div
        // Only insert if it isn't already there
        if(!formActions.querySelector('#smartButton')) {
            formActions.insertBefore(
                getSmartButton(
                    'SmartLink',
                    'SmartLink (fortryd)',
                    function() {
                        removeEmptyElementsByTagNames(editorDiv, ['h1', 'h2', 'h3', 'h4', 'p'])
                        convertHeadingsToBold(editorDiv, ['h1', 'h2', 'h3', 'h4'])
                        addSponsoredText(editorDiv,'Denne artikel indeholder sponsoreret indhold')
                    },
                    function () {
                        editorDiv.innerHTML = originalHtml
                    }
                ),
                formActions.children[formActions.children.length - 1]
            );
        }

        /* Rest are functions called from above */
        function getSmartButton(smartText, stupidText, smartCallback, stupidCallback) {
            const textElem = getElementWithContent('span', smartText)

            const logoElem = document.createElement('img')
            logoElem.src = chrome.runtime.getURL('/images/jfm-logo-32.png')

            const buttonContent = getElementWithContent('span', logoElem)
            buttonContent.appendChild(textElem)

            const smartLinkButton = getElementWithContent('a', buttonContent)
            smartLinkButton.id = 'smartButton'
            smartLinkButton.dataset.status = 'stupid'

            let state = 0

            smartLinkButton.addEventListener('click', function(e) {
                e.preventDefault()
                state = state ? 0 : 1

                if(state) {
                    smartCallback()
                    smartLinkButton.dataset.status = 'smart'
                    textElem.innerText = stupidText
                } else {
                    stupidCallback()
                    smartLinkButton.dataset.status = 'stupid'
                    textElem.innerText = smartText
                }
            })

            return smartLinkButton
        }

        function addSponsoredText(editorDiv, sponsoredText) {
            editorDiv.insertBefore(
                getElementWithElement('p', 'em', sponsoredText),
                editorDiv.children[0]
            );

            // Insert as last child
            editorDiv.appendChild(getElementWithElement('p', 'em', sponsoredText))
        }

        function convertHeadingsToBold(editorDiv, headingsToConvert) {
            headingsToConvert.forEach(function(headingType) {
                editorDiv.querySelectorAll(headingType).forEach(function(heading) {
                    // Add replacement paragraph before the heading element
                    heading.parentNode.insertBefore(
                        getElementWithElement('p', 'strong', heading.innerText),
                        heading
                    );

                    // Remove heading element
                    heading.remove()
                })
            })
        }

        function removeEmptyElementsByTagNames(editorDiv, tagNamesArray) {
            tagNamesArray.forEach(function(tagName) {
                editorDiv.querySelectorAll(tagName).forEach(function(tag) {
                    if(checkIfEmptyElement(tag)) {
                        tag.remove()
                    }
                })
            })
        }

        function checkIfEmptyElement(element) {
            // Element has only one childNode, probably element or textNode && that child is a br element or non-breaking-space html entity
            return (element.childNodes.length === 1 && (element.querySelector('br') || element.innerHTML === '&nbsp;'))
        }

        function getElementWithElement(outerTagName, innerTagName, content='') {
            return document.createElement(outerTagName)
                .appendChild(getElementWithContent(innerTagName, content))
        }

        function getElementWithContent(tagName, content) {
            const elem = document.createElement(tagName)

            if(content instanceof HTMLElement) {
                elem.appendChild(content)
            } else {
                elem.innerText = content
            }

            return elem
        }
    }
})()