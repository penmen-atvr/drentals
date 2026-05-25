const fs = require('fs');
const https = require('https');

const url = "https://storage.googleapis.com/pe-portal-consumer-prod-wagtail-static/images/googleplay-badge-01-getit.width-1440.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=wagtail%40pe-portal-consumer-prod.iam.gserviceaccount.com%2F20260525%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260525T090638Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=57a20eef745b03f9f0ecd016bd19e480648e150608014c231075c6dcdf7770b7e504c5062116d024898fb1e367bcbdeab77b039c8fd9d6629d8393c45c7334fa25077ba52153b09a3350066077baff8e88aa59a0b723ce3833dcfd0a5ab7c293557a6b7eaa96f19f925273ad7061ed686ef4dc2dc0f5eb9779bed03fc800cd29b9b003ef62862954e5aba930c8b7832c0440f839f336d59daaf8bc4e5e9eaf8c6836f15213b9e5e4096f6d3d3b53c9016737d9c966cac6ca01d39dff44ee5baa082eb9eedd3a642535f7ed16fafc57d94856962a6fd0a9af218f98235eb03e204983e820cb5b9f3779dfa262f03d77b1c8e7d0d2c8c0016ae2bdca806388040e";
const dest = "public/google-play-badge.png";

const file = fs.createWriteStream(dest);
https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Request Failed. Status Code: ${response.statusCode}`);
    response.resume();
    return;
  }
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete.');
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
