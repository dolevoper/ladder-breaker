(function () {
    const board = document.getElementById("board");
    const ctx = board.getContext("2d");

    const intersections = 19;
    const distanceBetweenIntersections = 40;
    const boardMargin = distanceBetweenIntersections;
    const boardSize = (intersections - 1) * distanceBetweenIntersections + boardMargin * 2;
    const canvasSize = 1000;
    const starPoints = [
        [4, 4],
        [4, 16],
        [16, 4],
        [16, 16],
        [4, 10],
        [10, 4],
        [10, 16],
        [16, 10],
        [10, 10]
    ];
    const stones = [
        ["white", 4, 17],
        ["white", 3, 16],
        ["white", 3, 15],
        ["white", 4, 14],
        ["white", 4, 13],
        ["black", 5, 17],
        ["black", 3, 14],
        ["black", 3, 13],
        ["black", 3, 12],
        ["black", 4, 12],

        ["white", 17, 3],
        ["white", 16, 2],
        ["white", 15, 2],
        ["white", 15, 3],
        ["white", 14, 4],
        ["black", 16, 3],
        ["black", 14, 3],
        ["black", 15, 4],
        ["black", 15, 5],
        ["black", 17, 5],
        ["black", 13, 4]
    ];

    const cordToPos = n => (n - 1) * distanceBetweenIntersections + boardMargin;

    requestAnimationFrame(function draw() {
        ctx.resetTransform();

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        ctx.translate((canvasSize - boardSize) / 2, (canvasSize - boardSize) / 2);

        drawBoard();
        drawStones();

        requestAnimationFrame(draw);
    });

    function drawBoard() {
        ctx.fillStyle = "brown";
        ctx.fillRect(0, 0, boardSize, boardSize);

        ctx.strokeRect(boardMargin, boardMargin, boardSize - 2 * boardMargin, boardSize - 2 * boardMargin);

        for (let i = 1; i <= intersections - 2; i++) {
            ctx.moveTo(boardMargin, i * distanceBetweenIntersections + boardMargin);
            ctx.lineTo(boardSize - boardMargin, i * distanceBetweenIntersections + boardMargin);
            ctx.moveTo(i * distanceBetweenIntersections + boardMargin, boardMargin);
            ctx.lineTo(i * distanceBetweenIntersections + boardMargin, boardSize - boardMargin);
        }

        ctx.stroke();

        ctx.fillStyle = "black";
        starPoints.forEach(cords => {
            const [x, y] = cords.map(cordToPos);

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI, true);
            ctx.fill();
        });
    }

    function drawStones() {
        stones.forEach(([color, ...cords]) => {
            const [x, y] = cords.map(cordToPos);

            ctx.beginPath();
            ctx.arc(x, y, distanceBetweenIntersections / 2, 0, 2 * Math.PI, true);
            ctx.fillStyle = color;
            ctx.fill();
        })
    }
})();
