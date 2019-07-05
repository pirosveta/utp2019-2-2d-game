'use strict';

const screenBlockSize = 25;  // Кол-во блоков 1х1, которые влазят на экран по высоте

const flatGen = (x, y, height) => {
    let arr = new Array
    for (let i = 0; i < x; i++) {
        arr[i]=new Array
        for (let j = 0; j < y; j++) {
            arr[i][j] = (j <= height)
        }
    }
    return arr
}

const image = new Image();
image.src = 'image.png';
image.onload = () => {
	const background = new Image();
	background.src = 'background.png';
	background.onload = () => {
        const r = new Render(image, background);    
        const chankWidth = 32, chankHeight = 32
        let chankFirstMatchInT = { }, t = [ ];
        const blocks = flatGen(100, 100, 25)  // Инициализация мира
        let cameraX = 0, cameraY = 0;  // Положение камеры


        const loadChank = (xLocate, yLocate, lt) => {
            const stopX = (xLocate + 1) * chankWidth
            const stopY = (yLocate + 1) * chankHeight
            chankFirstMatchInT[xLocate + 'x' + yLocate] = lt.length

            for (let i = xLocate * chankWidth; i < stopX; i++) {
                for (let j = yLocate * chankHeight; j < stopY; j++) {
                    if (i >= 0 && j >= 0 && i < blocks.length && j < blocks[Math.floor(i)].length) {
                        switch (blocks[Math.floor(i)][Math.floor(j)]) {  // Разделение отрисовки текстур по id блока
                            case true:
                                lt.push(r.createObject([i, j], [i + 1, j + 1], [0, 0], [1, 1], 5))
                                break;

                            case false:
                                lt.push({ })
                                break;

                            default:
                                throw Error('undefined block id')
                        }
                    } else {
                        lt.push({ })  // Каждый чанк занимает одинаковое место в t
                    }
                }
            }
        }

        const deleteChankByLocate = (xLocate, yLocate, lt) => {
            deleteChankById(xLocate + 'x' + yLocate, lt)
        }

        const deleteChankById = (id, lt) => {
            if (chankFirstMatchInT[id] == 'undefined') {
                return
            }

            const chankElems = chankWidth * chankHeight
            lt.splice(chankFirstMatchInT[id], chankElems)

            for (let i in chankFirstMatchInT) {
                if (chankFirstMatchInT[i] > chankFirstMatchInT[id]) {
                    chankFirstMatchInT[i] -= chankElems
                }
            }
            delete chankFirstMatchInT[id]
        }

		const update = (newtime) => {
            const curChankX = Math.floor(cameraX / chankWidth), curChankY = Math.floor(cameraY / chankHeight);
            for (let i in chankFirstMatchInT) {
                if ( !(i === curChankX + 'x' + curChankY ||
                i === curChankX + 1 + 'x' + curChankY ||
                i === curChankX - 1 + 'x' + curChankY ||
                i === curChankX + 'x' + (curChankY + 1) ||
                i === curChankX + 'x' + (curChankY - 1) ||
                i === curChankX + 1 + 'x' + (curChankY + 1) ||
                i === curChankX + 1 + 'x' + (curChankY - 1) ||
                i === curChankX - 1 + 'x' + (curChankY + 1) ||
                i === curChankX - 1 + 'x' + (curChankY - 1)) ) {  // Если не чанк в +\- 1 от некущего
                    deleteChankById(i, t)
                }
            }
            for (let i = curChankX - 1; i <= curChankX + 1; i++) {
                for (let j = curChankY - 1; j <= curChankY + 1; j++) {
                    console.log(chankFirstMatchInT[i + 'x' + j])
                    if (chankFirstMatchInT[i + 'x' + j] === undefined) {  // Если чанки вокруг (на 1) выгружены - загружаем их
                        loadChank(i, j, t)
                    }
                }
            }
            r.render(cameraX += 0.1, cameraY += 0.1, screenBlockSize, t);
			requestAnimationFrame(update);
		}
		requestAnimationFrame(update);
    };
};
