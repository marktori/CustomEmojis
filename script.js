{
    const CONFIG = {
        SCALE: 2, // 이모지의 크기 ex) 폰트 사이즈 * 1.2

        // 이모지 목록
        EMOJIS: {
            "내이모지": "https://i.imgur.com/pArCl2m.png"
            "blobangery": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobangery.webp",
            "blobangry": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobangry.webp",
            "blobaww": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobaww.webp",
            "blobcry": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobcry.webp",
            "blobdead": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobdead.webp",
            "blobfearful": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobfearful.webp",
            "blobimfine": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobimfine.webp",
            "blobpats": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobpats.webp",
            "blobrofl": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobrofl.webp",
            "blobsad": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobsad.webp",
            "blobsadrain": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobsadrain.webp",
            "blobsob": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobsob.webp",
            "blobthinking": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobthinking.webp",
            "blobthumbsup": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobthumbsup.webp",
            "blobyum": "https://raw.githubusercontent.com/simnple/CustomEmojis/refs/heads/main/img/blobyum.webp"
        }
    };

    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    function replaceEmojis(rootElement) {
        const emojiKeys = Object.keys(CONFIG.EMOJIS);
        if (emojiKeys.length === 0) return;

        const escapedKeys = emojiKeys.map(escapeRegExp);
        const regexPattern = new RegExp(`:(${escapedKeys.join('|')}):`);

        const walker = document.createTreeWalker(
            rootElement,
            NodeFilter.SHOW_TEXT,
            null
        );

        const matches = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;

            if (!node.parentNode) continue;

            const parentTag = node.parentNode.tagName;
            
            if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'TEXTAREA') {
                continue;
            }

            if (regexPattern.test(node.nodeValue)) {
                matches.push(node);
            }
        }

        matches.forEach(node => {
            let currentTextNode = node;
            
            if (!currentTextNode.parentNode) return;

            const parent = currentTextNode.parentNode;
            const style = window.getComputedStyle(parent);
            const fontSize = parseFloat(style.fontSize) || 20;
            const fixedFontSize = (fontSize * CONFIG.SCALE) + 'px';

            while (true) {
                const content = currentTextNode.nodeValue;
                const matchResult = content.match(regexPattern);

                if (!matchResult) break;

                const fullMatchStr = matchResult[0];
                const emojiName = matchResult[1];
                const index = matchResult.index;
                
                const matchNode = currentTextNode.splitText(index);
                const afterNode = matchNode.splitText(fullMatchStr.length);

                const img = document.createElement('img');
                img.src = CONFIG.EMOJIS[emojiName];

                img.alt = fullMatchStr; 
                img.title = fullMatchStr;
                
                img.style.width = fixedFontSize;
                img.style.height = fixedFontSize;
                img.style.display = 'inline-block'; 
                img.style.verticalAlign = 'middle'; 
                img.style.margin = '0 2px';

                matchNode.parentNode.replaceChild(img, matchNode);

                currentTextNode = afterNode;
            }
        });
    }

    window.addEventListener('load', function() {
        setTimeout(function() {
            replaceEmojis(document.body);
        }, 0);
    });
}
