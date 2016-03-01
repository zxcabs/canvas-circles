/**
 * @author "Evgeny Reznichenko" <kusakyky@gmail.com>
 */

var
    shouldAnimate = true,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext("2d"),

    r = canvas.width / 5,
    x = 0,
    y = 0,
    kr = 0.09,
    s = 3,
    animateDegree = 1,

    PI_2 = Math.PI * 2;



function CircleSun(x, y, r, k, step) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.k = k;
    this.step = step;
    this.circls;

    if (step > 0) {
        this.initCircls(3 * step * 2, step % 2 == 0);
    }
}

CircleSun.prototype.draw = function(context) {

    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, PI_2, true);
    context.strokeStyle = "rgba(0, 0, 0, 0.2)";
    context.stroke();
    context.closePath();

    if (this.circls) {
        this.circls.forEach(function (circl) {
            circl.draw(context);
        });
    }
};

CircleSun.prototype.initCircls = function(count, offset) {
    var
        circls = this.circls = [],
        step = PI_2 / count,
        alpha;

    for (var i = (offset) ? 0 : 0.5; i < count; i++) {
        alpha = step * i;

        var orbitCoords = this.getOrbitPoint(this.x, this.y, this.r + this.r * this.k * (this.step), alpha);
        circls.push(new CircleSun(orbitCoords.x, orbitCoords.y, this.r * this.k, this.k / (8 / count), this.step - 1));
    }
};

CircleSun.prototype.getOrbitPoint = function(x, y, r, alpha) {
    var
        x0 = x + r,
        y0 = y,
        rx = x0 - x,
        ry = y0 - y,
        c = Math.cos(alpha),
        s = Math.sin(alpha),
        x1 = x + rx * c - ry * s,
        y1 = y + rx * s + ry * c;

    return {
        x: Math.round(x1),
        y: Math.round(y1)
    };
};

var
    circleSun = new CircleSun(0, 0, r, kr, s),
    fpsCounter = (function () {
        var
            count = 0,
            fps = 0,
            now = Date.now(),
            start = now;

        return function () {
            count += 1;

            if (count === 10) {
                now = Date.now();
                fps = (now - start) / count;
                count = 0;
                start = now;
            }

            return fps;
        };
    })();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(animateDegree * Math.PI / 180);

    circleSun.draw(ctx);

    ctx.restore();

    ctx.fillText('fps: ' + fpsCounter().toFixed(1), 20, 20);

    animateDegree += 1;

    window.requestAnimationFrame(animate);
}

animate();
