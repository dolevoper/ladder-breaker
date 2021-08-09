(function () {
    const board = document.getElementById("board");
    const generateNewPositionButton = document.getElementById("generateNewPosition");

    generateNewPositionButton.addEventListener("click", generateProblem);

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
    let stones = [];

    const sourceComponents = [
        [
            ["white", 5, 2],
            ["white", 4, 1],
            ["white", 3, 1],
            ["white", 3, 2],
            ["white", 2, 3],
            ["black", 4, 2],
            ["black", 2, 2],
            ["black", 3, 3],
            ["black", 3, 4],
            ["black", 5, 4],
            ["black", 1, 3]
        ]
    ];

    const destinationComponents = [
        [
            ["white", 2, 6],
            ["white", 1, 5],
            ["white", 1, 4],
            ["white", 2, 3],
            ["white", 2, 2],
            ["black", 3, 6],
            ["black", 1, 3],
            ["black", 1, 2],
            ["black", 1, 1],
            ["black", 2, 1]
        ]
    ];

    const cordToPos = n => (n - 1) * distanceBetweenIntersections + boardMargin;
    const binary = fn => (a, b) => fn(a, b);

    generateProblem();

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

    function generateProblem() {
        const sourceComponent = sourceComponents[Math.floor(Math.random() * sourceComponents.length)];
        const destinationComponent = destinationComponents[Math.floor(Math.random() * destinationComponents.length)];

        const sourceDimensions = calcComponentDimensions(sourceComponent);
        const sourceOffset = [
            Math.floor(Math.random() * ((intersections + 1) / 2 - sourceDimensions[0] + 1)),
            Math.floor(Math.random() * ((intersections + 1) / 2 - sourceDimensions[1] + 1))
        ];

        const destinationDimensions = calcComponentDimensions(destinationComponent);
        const destinationOffset = [
            Math.floor(Math.random() * ((intersections + 1) / 2 - destinationDimensions[0] + 1)),
            Math.floor(Math.random() * ((intersections + 1) / 2 - destinationDimensions[1] + 1))
        ];

        stones = [
            ...sourceComponent.map(([color, x, y]) => [color, x + (intersections - 1) / 2 + sourceOffset[0], y + sourceOffset[1]]),
            ...destinationComponent.map(([color, x, y]) => [color, x + destinationOffset[0], y + (intersections - 1) / 2 + destinationOffset[1]])
        ];
    }

    function calcComponentDimensions(component) {
        return [
            component.map(([_, x]) => x).reduce(binary(Math.max), 0),
            component.map(([_, __, y]) => y).reduce(binary(Math.max), 0)
        ];
    }
})();
