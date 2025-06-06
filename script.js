document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('scratch-canvas');
  const ctx = canvas.getContext('2d');
  const container = document.querySelector('.scratch-frame');
  const instructions = document.getElementById('instructions');
  const instructionsArrow = document.getElementById('instructionsArrow');
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  const coverImage = new Image();
  const brush = new Image();
  
  var isDrawing, lastPoint;
  var canvasWidth  = width;
  var canvasHeight = height;
  
  coverImage.src = 'image2_s.png';
  coverImage.crossOrigin = "Anonymous";


  brush.src = 'brush1.png'
  
  coverImage.onload = () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(coverImage, 0, 0, coverImage.width, coverImage.height, 0, 0, width, height);
    ctx.globalCompositeOperation = 'destination-out';

	  canvas.addEventListener('mousedown', handleMouseDown, false);
	  canvas.addEventListener('touchstart', handleMouseDown, false);
	  canvas.addEventListener('mousemove', handleMouseMove, false);
	  canvas.addEventListener('touchmove', handleMouseMove, false);
	  canvas.addEventListener('mouseup', handleMouseUp, false);
	  canvas.addEventListener('touchend', handleMouseUp, false);
	  
	  function distanceBetween(point1, point2) {
		return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
	  }
	  
	  function angleBetween(point1, point2) {
		return Math.atan2( point2.x - point1.x, point2.y - point1.y );
	  }
	  
	  // Only test every `stride` pixel. `stride`x faster,
	  // but might lead to inaccuracy
	  function getFilledInPixels(stride) {
		if (!stride || stride < 1) { stride = 1; }
		
		var pixels   = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
			pdata    = pixels.data,
			l        = pdata.length,
			total    = (l / stride),
			count    = 0;
		
		// Iterate over all pixels
		for(var i = count = 0; i < l; i += stride) {
		  if (parseInt(pdata[i]) === 0) {
			count++;
		  }
		}
		
		return Math.round((count / total) * 100);
	  }
	  
	  function getMouse(e, canvas) {
		var offsetX = 0, offsetY = 0, mx, my;

		if (canvas.offsetParent !== undefined) {
		  do {
			offsetX += canvas.offsetLeft;
			offsetY += canvas.offsetTop;
		  } while ((canvas = canvas.offsetParent));
		}

		mx = (e.pageX || e.touches[0].clientX) - offsetX;
		my = (e.pageY || e.touches[0].clientY) - offsetY;

		return {x: mx, y: my};
	  }
	  
	  function handlePercentage(filledInPixels) {
		filledInPixels = filledInPixels || 0;
		console.log(filledInPixels + '%');
		if (filledInPixels > 50) {
		  canvas.parentNode.removeChild(canvas);
		  instructions.innerHTML = "Скинь в чат фото с пивком чтобы узнать где и как забрать свой вертак";
		  instructionsArrow.innerHTML = "&#11013";
		  poof();
		}
	  }
	  
	  function handleMouseDown(e) {
		isDrawing = true;
		lastPoint = getMouse(e, canvas);
		if (audio.paused) {
			audio.play().catch(() => {});
			toggleBtn.textContent = '⏸';
			audioManual.style.display = "none";
		}
	  }

	  function handleMouseMove(e) {
		if (!isDrawing) { return; }
		
		e.preventDefault();

		var currentPoint = getMouse(e, canvas),
			dist = distanceBetween(lastPoint, currentPoint),
			angle = angleBetween(lastPoint, currentPoint),
			x, y;
		
		for (var i = 0; i < dist; i++) {
		  x = lastPoint.x + (Math.sin(angle) * i) - 25;
		  y = lastPoint.y + (Math.cos(angle) * i) - 25;
		  ctx.globalCompositeOperation = 'destination-out';
		  ctx.drawImage(brush, x, y);
		}
		
		lastPoint = currentPoint;
		handlePercentage(getFilledInPixels(32));
	  }

	  function handleMouseUp(e) {
		isDrawing = false;
	  }
  };

  // Аудиоплеер логика
const audio = document.getElementById('bg-audio');
const toggleBtn = document.getElementById('audio-toggle');
const audioManual = document.querySelector('.audio-manual');
// Размутить и начать при загрузке
window.addEventListener('load', () => {
	audio.muted = false;
	var playPromise = audio.play();
	if (playPromise !== undefined) {
        playPromise.then(() => {
            toggleBtn.textContent = '⏸';
			audioManual.style.display = "none";
        }).catch(error => {
            toggleBtn.textContent = '⏵';
			audioManual.style.display = "flex";
        });
    }
});

toggleBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => {});
    toggleBtn.textContent = '⏸';
	audioManual.style.display = "none";
  } else {
    audio.pause();
    toggleBtn.textContent = '⏵';
  }
});


//конфети
// Globals
  var random = Math.random
    , cos = Math.cos
    , sin = Math.sin
    , PI = Math.PI
    , PI2 = PI * 2
    , timer = undefined
    , frame = undefined
    , confetti = [];

  var particles = 10
    , spread = 40
    , sizeMin = 3
    , sizeMax = 12 - sizeMin
    , eccentricity = 10
    , deviation = 100
    , dxThetaMin = -.1
    , dxThetaMax = -dxThetaMin - dxThetaMin
    , dyMin = .13
    , dyMax = .18
    , dThetaMin = .4
    , dThetaMax = .7 - dThetaMin;

  var colorThemes = [
    function() {
      return color(200 * random()|0, 200 * random()|0, 200 * random()|0);
    }, function() {
      var black = 200 * random()|0; return color(200, black, black);
    }, function() {
      var black = 200 * random()|0; return color(black, 200, black);
    }, function() {
      var black = 200 * random()|0; return color(black, black, 200);
    }, function() {
      return color(200, 100, 200 * random()|0);
    }, function() {
      return color(200 * random()|0, 200, 200);
    }, function() {
      var black = 256 * random()|0; return color(black, black, black);
    }, function() {
      return colorThemes[random() < .5 ? 1 : 2]();
    }, function() {
      return colorThemes[random() < .5 ? 3 : 5]();
    }, function() {
      return colorThemes[random() < .5 ? 2 : 4]();
    }
  ];
  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return (1-cos(PI*t))/2 * (b-a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  var radius = 1/eccentricity, radius2 = radius+radius;
  function createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    var domain = [radius, 1-radius], measure = 1-radius2, spline = [0, 1];
    while (measure) {
      var dart = measure * random(), i, l, interval, a, b, c, d;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i+1], interval = b-a;
        if (dart < measure+interval) {
          spline.push(dart += a-measure);
          break;
        }
        measure += interval;
      }
      c = dart-radius, d = dart+radius;

      // Update the domain
      for (i = domain.length-1; i > 0; i -= 2) {
        l = i-1, a = domain[l], b = domain[i];
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2); // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      // Re-measure the domain
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i+1]-domain[i];
    }

    return spline.sort();
  }

  // Create the overarching container
  var confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top      = '0';
  confettiContainer.style.left     = '0';
  confettiContainer.style.width    = '100%';
  confettiContainer.style.height   = '0';
  confettiContainer.style.overflow = 'visible';
  confettiContainer.style.zIndex   = '9999';

  // Confetto constructor
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style, innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width  = (sizeMin + sizeMax * random()) + 'px';
    outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
    innerStyle.width  = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * random()) + 'deg)';
    this.axis = 'rotate3D(' +
      cos(360 * random()) + ',' +
      cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';

    this.x = window.innerWidth * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top  = this.y + 'px';

    // Create the periodic spline
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length-1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function(height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      var phi = this.frame % 7777 / 7777, i = 0, j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi-this.splineX[i]) / (this.splineX[j]-this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top  = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height+deviation;
    };
  }

  function poof() {
    if (!frame) {
      // Append the container
      document.body.appendChild(confettiContainer);

      // Add confetti
      var theme = colorThemes[0]
        , count = 0;
      (function addConfetto() {
        var confetto = new Confetto(theme);
        confetti.push(confetto);
        confettiContainer.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })(0);

      // Start the loop
      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = window.innerHeight;

        for (var i = confetti.length-1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            confettiContainer.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length)
          return frame = requestAnimationFrame(loop);

        // Cleanup
        document.body.removeChild(confettiContainer);
        frame = undefined;
      });
    }
  }

});
