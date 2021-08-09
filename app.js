(function () {
    const board = document.getElementById("board");
    const drawingContext = board.getContext("2d");

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

    requestAnimationFrame(function drawingLoop() {
        drawingContext.resetTransform();

        drawingContext.fillStyle = "black";
        drawingContext.fillRect(0, 0, canvasSize, canvasSize);

        drawingContext.translate((canvasSize - boardSize) / 2, (canvasSize - boardSize) / 2);

        drawBoard();

        requestAnimationFrame(drawingLoop);
    });

    function drawBoard() {
        drawingContext.fillStyle = "brown";
        drawingContext.fillRect(0, 0, boardSize, boardSize);

        drawingContext.strokeRect(boardMargin, boardMargin, boardSize - 2 * boardMargin, boardSize - 2 * boardMargin);

        for (let i = 1; i <= intersections - 2; i++) {
            drawingContext.moveTo(boardMargin, i * distanceBetweenIntersections + boardMargin);
            drawingContext.lineTo(boardSize - boardMargin, i * distanceBetweenIntersections + boardMargin);
            drawingContext.moveTo(i * distanceBetweenIntersections + boardMargin, boardMargin);
            drawingContext.lineTo(i * distanceBetweenIntersections + boardMargin, boardSize - boardMargin);
        }

        drawingContext.stroke();

        drawingContext.fillStyle = "black";
        starPoints.forEach(cords => {
            const [x, y] = cords.map(n => (n - 1) * distanceBetweenIntersections + boardMargin);
            drawingContext.beginPath();
            drawingContext.arc(x, y, 5, 0, 2 * Math.PI, true);
            drawingContext.fill();
        });
    }
})();
