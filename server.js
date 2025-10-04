const { leetcode } = require('./leetcode');
const express = require('express');
const app = express();
const port = 3000;

// Helper: funkcje SVG
function circle_circumference(r){
  return 2 * Math.PI * r;
}

// Endpoint SVG dynamiczne na podstawie danych z LeetCode
app.get('/api/svg/:username', (req, res) => {
  
  // Tworzymy "mock" obiektów req i res, żeby wywołać funkcję z leetcode.js
  const mockReq = { params: { id: req.params.username } };
  const scale = req.query.scale || 1; // domyślnie 1

  const mockRes = {
    send: (leetcodeData) => {

      // Teraz masz dane z LeetCode i możesz ich użyć w SVG
      const totalSolved = leetcodeData.totalSolved;
      // const totalQuestions = leetcodeData.totalQuestions;
      const easySolved = leetcodeData.easySolved;
      const totalEasy = leetcodeData.totalEasy;
      const mediumSolved = leetcodeData.mediumSolved;
      const totalMedium = leetcodeData.totalMedium;
      const hardSolved = leetcodeData.hardSolved;
      const totalHard = leetcodeData.totalHard;
      const today = new Date();

      // ustaw godzinę na 00:00:00 UTC
      today.setUTCHours(0, 0, 0, 0);

      // zamień na Unix timestamp w sekundach
      const todayTimestamp = Math.floor(today.getTime() / 1000);

      const radiuses=[32*scale,32*0.9*scale,32*0.8*scale];

      const svg = `
<svg version="1.1" id="circle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 ${200*scale} ${100*scale}" xml:space="preserve">
    <rect width="200" height="100" fill="#0d1117"/>


   <circle fill="none" stroke="#d3e1f9ff" stroke-width="${4.1*scale}" cx="${50*scale}" cy="${50*scale}" r="${radiuses[0]}"
          stroke-linecap="round"
          transform="rotate(-90 ${50*scale} ${50*scale})">
  </circle>
     <circle fill="none" stroke="#d3e1f9ff" stroke-width="${3.6*scale}" cx="${50*scale}" cy="${50*scale}" r="${radiuses[1]}"
          stroke-linecap="round"
          transform="rotate(-90 ${50*scale} ${50*scale})">
  </circle>
     <circle fill="none" stroke="#d3e1f9ff" stroke-width="${3.1*scale}" cx="${50*scale}" cy="${50*scale}" r="${radiuses[2]}"
          stroke-linecap="round"
          transform="rotate(-90 ${50*scale} ${50*scale})">
  </circle>
  
  <circle fill="none" stroke="#4ecdc4" stroke-width="${4*scale}" cx="${50*scale}" cy="${50*scale}" r="${radiuses[0]}"
          stroke-dasharray="${circle_circumference(radiuses[0])}" stroke-linecap="round"
          transform="rotate(-90 ${50*scale} ${50*scale})">
<animate attributeName="stroke-dashoffset"
values="${circle_circumference(radiuses[0])}; ${circle_circumference(radiuses[0])*(1-easySolved/totalEasy/2)}; ${circle_circumference(radiuses[0])*(1-easySolved/totalEasy)}"
keyTimes="0;0.5;1"
         dur="1.5s"
         fill="freeze"
         calcMode="spline"
         keySplines="0.42 0 1 1  0 0 0.58 1"
 />
  </circle>
  
  <circle fill="none" stroke="#f58549" stroke-width="${3.5*scale}" cx="${50*scale}" cy="${50*scale}" r="${radiuses[1]}"
          stroke-dasharray="${circle_circumference(radiuses[1])}" stroke-linecap="round"
          transform="rotate(-90 ${50*scale} ${50*scale})">
<animate attributeName="stroke-dashoffset"
values="${circle_circumference(radiuses[1])}; ${circle_circumference(radiuses[1])*(1-mediumSolved/totalMedium/2)}; ${circle_circumference(radiuses[1])*(1-mediumSolved/totalMedium)}"
keyTimes="0;0.5;1"
         dur="1.7s"
         fill="freeze"
         calcMode="spline"
         keySplines="0.42 0 1 1  0 0 0.58 1"
 />

  </circle>
    <circle fill="none" stroke="#ff6b6b" stroke-width="${3*scale}" cx="${50*scale}" cy="${50*scale}" r="${radiuses[2]}"
          stroke-dasharray="${circle_circumference(radiuses[2])}" stroke-linecap="round"
          transform="rotate(-90 ${50*scale} ${50*scale})">
<animate attributeName="stroke-dashoffset"
values="${circle_circumference(radiuses[2])}; ${circle_circumference(radiuses[2])*(1-hardSolved/totalHard/2)}; ${circle_circumference(radiuses[2])*(1-hardSolved/totalHard)}"
keyTimes="0;0.5;1"
         dur="1.9s"
         fill="freeze"
         calcMode="spline"
         keySplines="0.42 0 1 1  0 0 0.58 1"
  
 />  </circle>

 <style>
@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 400;
  font-display: fallback;
  src: url(data:font/truetype;base64,AAEAAAAQAQAABAAAR0RFRgBZAEIAAAF8AAAAIkdQT1NEdEx1AAABHAAAAB5HU1VCmldiDgAABbwAAAKOT1MvMoqnmVsAAALcAAAAYFNUQVR5kWzdAAABxAAAAC5jbWFwAUoB8gAAAzwAAABkZ2FzcAAAABAAAAEUAAAACGdseWZMSuRUAAAITAAADMBoZWFkEucm+wAAAfQAAAA2aGhlYQMr/Y4AAAGgAAAAJGhtdHgRQQITAAACLAAAAFZsb2NhTy9MegAAAoQAAABWbWF4cACYAoIAAAE8AAAAIG5hbWUsoUzqAAADoAAAAhxwb3N0/58AMwAAAVwAAAAgcHJlcGgGjIUAAAEMAAAAB7gB/4WwBI0AAAEAAf//AA8AAQAAAAoAHAAcAAFERkxUAAgABAAAAAD//wAAAAAAAAABAAAAKgIGAGAAeAAKAAEAAAAAAAAAAAAAAAAAAwADAAMAAAAAAAD/nAAyAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQAAAAwAAAAAAAAAAgADAAEADAABAA4AIgABACQAJAACAAAAAQAAB7z9fAAACWDyHfawCVAAAQAAAAAAAAAAAAAAAAAAAAEAAQABAAgAAQAAABQAAQAAABwAAndnaHQBAAAAAAIAAwAAAAIBAgGQAAACvAAAAAAAAQAAAAUAgyvXlplfDzz1AAMH0AAAAADbCS13AAAAAN1Vrr7yHfwYCVAJYAAAAAYAAgAAAAAAAASwAFAApwBbAFAAiQDJALcAiACdALwAgwDJAPEA8QDxAL8A1AB4AGUAyQCTAMkAkwDTAJMAnwDJAHkAIwBvAHsAzQDxAL8AeAAA92QBlwAA/a8AAAHdAAAAAABQAGgApgC5APoBLgFcAZEByAHwAlcCewKhArcCwgLuAwkDKQNgA4QDsAPkBBkERwSIBK8E0QTnBQMFIAVCBVgFfgWqBcoFygYPBjwGPAZJBkkGYAAAAAQEuQGQAAUAAAT0BJIAAACSBPQEkgAAAqsAMgJ4AAACCwgJBQAAAgAE4AAC7xIB+fsCACAYAAAAAENUREIAwAAgAHoHvP18AAAIdAPoYAAAn9/XAAAEHQVhAAAAIAAFAAAAAgAAAAMAAAAUAAMAAQAAABQABABQAAAAEAAQAAMAAAAgADsASABRAFQAaQB6//8AAAAgADsASABRAFQAYQBq//8ACP/q/7n/sf+v/6P/pQABAAAAAAAAAAAAAAAAAAAAAAAAAAoAfgADAAEECQAAAKwA8gADAAEECQABABIA4AADAAEECQACAA4A0gADAAEECQADADYAnAADAAEECQAEACIAegADAAEECQAFABoAYAADAAEECQAGACAAQAADAAEECQAOADQADAADAAEECQEAAAwAAAADAAEECQECAA4A0gBXAGUAaQBnAGgAdABoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwARgBpAHIAYQBDAG8AZABlAC0AUgBlAGcAdQBsAGEAcgBWAGUAcgBzAGkAbwBuACAANQAuADAAMAAyAEYAaQByAGEAIABDAG8AZABlACAAUgBlAGcAdQBsAGEAcgA1AC4AMAAwADIAOwBDAFQARABCADsARgBpAHIAYQBDAG8AZABlAC0AUgBlAGcAdQBsAGEAcgBSAGUAZwB1AGwAYQByAEYAaQByAGEAIABDAG8AZABlAEMAbwBwAHkAcgBpAGcAaAB0ACAAMgAwADEANAAtADIAMAAyADAAIABUAGgAZQAgAEYAaQByAGEAIABDAG8AZABlACAAUAByAG8AagBlAGMAdAAgAEEAdQB0AGgAbwByAHMAIAAoAGgAdAB0AHAAcwA6AC8ALwBnAGkAdABoAHUAYgAuAGMAbwBtAC8AdABvAG4AcwBrAHkALwBGAGkAcgBhAEMAbwBkAGUAKQABAAAACgCQAN4ABkRGTFQAemN5cmwAemdyZWsAemxhdG4AJnppbmgAenp5eXkAegBYAAVBWkUgAEpDUlQgAEBLQVogADZUQVQgACxUUksgACIAAP//AAIAAAAFAAD//wACAAAABAAA//8AAgAAAAMAAP//AAIAAAACAAD//wACAAAAAQAEAAAAAP//AAEAAAAGY2FsdABEbG9jbAA+bG9jbAA4bG9jbAAybG9jbAAsbG9jbAAmAAAAAQABAAAAAQAAAAAAAQACAAAAAQAEAAAAAQADAAAAAwAFAAkADAAOAZwBnAGcAZwBnAEgARIBBAEEAKYAmACKADwAHgABAAAAAQAIAAIADAADACAAIQAiAAEAAwAMAA8AEQAGAAAAAgAqAAoAAwABABgAAQASAAAAAQAAAA0AAQABABEAAQACAAMAIgADAAEAGgAB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) format('truetype');
}
</style>
                 <path id="path0">
                            <!-- Single line -->
                                <animate id="d0" attributeName="d" begin="0s;d2.end-1000ms" dur="6000ms" fill="remove" values="m0,${50*scale} h0 ; m0,${50*scale} h${100*scale} ; m0,${50*scale} h${100*scale} ; m0,${50*scale} h0" keyTimes="0;0.7;0.8;1"/>
                    </path>
    <text font-family="&quot;Fira Code&quot;, monospace" fill="#4ecdc4" font-size="${6*scale}" x="${50*scale}" y="${50*scale}"  text-anchor="middle"  dominant-baseline="middle" letter-spacing="normal">
        <textPath xlink:href="#path0">
            Easy: ${easySolved}/${totalEasy}
        </textPath>
    </text>
        <path id="path1">
                            <!-- Single line -->
                                <animate id="d1" attributeName="d" begin="d0.end-1000ms" dur="6000ms" fill="remove" values="m0,${50*scale} h0 ; m0,${50*scale} h${100*scale} ; m0,${50*scale} h${100*scale} ; m0,${50*scale} h0" keyTimes="0;0.66666666666667;0.83333333333333;1"/>
                    </path>
    <text font-family="&quot;Fira Code&quot;, monospace" fill="#f58549" font-size="${6*scale}" x="${50*scale}" y="${50*scale}"  text-anchor="middle"  dominant-baseline="middle"  letter-spacing="normal">
        <textPath xlink:href="#path1">
            Mid: ${mediumSolved}/${totalMedium}
        </textPath>
    </text>

<script xmlns=""/>
        <path id="path2">
                            <!-- Single line -->
                                <animate id="d2" attributeName="d" begin="d1.end-1000ms" dur="6000ms" fill="remove" values="m0,${50*scale} h0 ; m0,${50*scale} h${100*scale} ; m0,${50*scale} h${100*scale} ; m0,${50*scale} h0" keyTimes="0;0.66666666666667;0.83333333333333;1"/>
                    </path>
    <text font-family="&quot;Fira Code&quot;, monospace" fill="#ff6b6b" font-size="${6*scale}" x="${50*scale}" y="${50*scale}"  text-anchor="middle"  dominant-baseline="middle"  letter-spacing="normal">
        <textPath xlink:href="#path2">
            Hard: ${hardSolved}/${totalHard}
        </textPath>
    </text>
<text 
    x="${(50+radiuses[0]/scale+15)*scale}" 
    y="${30*scale}" 
    text-anchor="start" 
    dominant-baseline="middle" 
    font-family="&quot;Fira Code&quot;, monospace"
    font-size="${7*scale}" 
    fill="#4ecdc4">
    LeetCode Stats ✨
  </text>
<text 
    x="${(50+radiuses[0]/scale+15)*scale}" 
    y="${40*scale}" 
    text-anchor="start" 
    dominant-baseline="middle" 
    font-family="&quot;Fira Code&quot;, monospace"
    font-size="${5*scale}" 
    fill="#4ecdc4">
    Tag: ${mockReq.params.id}
  </text>
  <text 
    x="${(50+radiuses[0]/scale+15)*scale}" 
    y="${50*scale}" 
    text-anchor="start" 
    dominant-baseline="middle" 
    font-family="&quot;Fira Code&quot;, monospace"
    font-size="${5*scale}" 
    fill="#4ecdc4">
    Started at: Oct. 2025
  </text>
    <text 
    x="${(50+radiuses[0]/scale+15)*scale}" 
    y="${60*scale}" 
    text-anchor="start" 
    dominant-baseline="middle" 
    font-family="&quot;Fira Code&quot;, monospace"
    font-size="${5*scale}" 
    fill="#4ecdc4">
${leetcodeData?.submissionCalendar?.[todayTimestamp] != 0 
  ? "Today solved: " + leetcodeData.submissionCalendar[todayTimestamp].toString() 
  : ""}  </text>
  <text 
    x="${100*scale}" 
    y="${95*scale}" 
    text-anchor="middle" 
    dominant-baseline="middle" 
    font-family="&quot;Fira Code&quot;, monospace"
    font-size="${3*scale}" 
    fill="#4ecdc4">
I made this banner myself using API from Faisal Shohag. The repo is in my profile.    </text>

</svg>
      `;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    }
  };

  // Wywołujemy funkcję z leetcode.js
  leetcode(mockReq, mockRes);
});

app.listen(port, () => {
  console.log(`Server działa na http://localhost:${port}`);
});
