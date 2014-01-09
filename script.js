/*global majaX, initDisTime, disTime */
/*jslint browser: true, plusplus: true, indent: 2 */

var repoContent, repoName, foldername = false, userName, repos, apiurl, root, lastUpdate;
userName = 'SimonWaldherr';
apiurl = 'https://api.github.com/users/simonwaldherr/repos?type=owner&sort=updated';

function buildRepoTable() {
  "use strict";
  var i = 0, string = '';
  string += '<ul class="repolist js-repo-list" data-filterable-for="your-repos-filter" data-filterable-type="substring">';
  for (i = 0; i < repos.length; i++) {
    lastUpdate = new Date(repos[i].updated_at);
    if (repos[i].fork === true && repos[i].homepage.indexOf('waldherr') === -1 && repos[i].homepage.indexOf('waldherr') === -1 && repos[i].homepage.indexOf('shownot') === -1 && repos[i].homepage.indexOf('chocolatechip') === -1 && repos[i].homepage.indexOf('podlove') === -1 && repos[i].homepage.indexOf('microjs') === -1) {
      string += '<!-- ' + repos[i].name + ' -->';
    } else {
      if (repos[i].fork === false) {
        string += '<li class="simple public source">';
      } else {
        string += '<li class="simple public fork">';
      }
      string += '<ul class="repo-stats"><li class="stargazers"><a href="https://github.com/SimonWaldherr/' + repos[i].name + '/stargazers" title="Stargazers"><span class="octicon octicon-star"></span> ' + repos[i].watchers_count + '</a></li><li class="forks"><a href="https://github.com/SimonWaldherr/' + repos[i].name + '/network" title="Forks"><span class="octicon octicon-git-branch"></span> ' + repos[i].forks_count + '</a></li></ul><h3>';
      if (repos[i].fork === false) {
        string += '<span class="mega-octicon octicon-repo">';
      } else {
        string += '<span class="mega-octicon octicon-repo-forked">';
      }
      string += '</span><a href="https://github.com/SimonWaldherr/' + repos[i].name + '">' + repos[i].name + '</a></h3><div class="body"><p class="description">' + repos[i].description + '</p><p class="updated-at">Last updated <time class="js-relative-date distime" data-time="' + lastUpdate.getTime() / 1000 + '"></time></p><div class="participation-graph"></div></div></li>';
    }
  }
  string += '</ul>';
  document.getElementById('repo').innerHTML = string;
  initDisTime();
}

function buildRepoContentTable() {
  "use strict";
  var i = 0, string;
  if (root === 1) {
    string = '<p onclick="buildRepoTable();">show repos</p><table><thead><tr><th>name</th><th>size</th><th>type</th><th></th></tr></thead><tbody>';
  } else {
    string = '<p onclick="root-=2; openRepoDir();">back</p><table><thead><tr><th>name</th><th>size</th><th>type</th><th></th></tr></thead><tbody>';
  }
  root++;

  for (i = 0; i < repoContent.length; i++) {
    if (repoContent[i].type === 'file') {
      string += '<tr><td>' + repoContent[i].name + '</td><td>' + parseInt(repoContent[i].size / 100, 10) / 10 + 'kB</td><td>' + repoContent[i].type + '</td><td><a href="' + repoContent[i].html_url.replace("https://github.com/", "https://raw.github.com/").replace("/blob/", "/") + '">source</a></td></tr>';
    } else {
      string += '<tr><td>' + repoContent[i].name + '</td><td></td><td>' + repoContent[i].type + '</td><td><a href="#" onclick="foldername = \'' + repoContent[i].name + '\'; openRepoDir(); return false;">open</a></td></tr>';
    }
  }
  string += '</tbody></table>';
  document.getElementById('repo').innerHTML = string;
}

function openRepoDir() {
  "use strict";
  if (foldername !== false) {
    majaX({url: 'https://github.com/' + userName + '/' + repoName + '/' + foldername, method: 'API'}, function (json) {repoContent = json; buildRepoContentTable(root + 1); });
  } else {
    majaX({url: 'https://github.com/' + userName + '/' + repoName, method: 'API'}, function (json) {repoContent = json; buildRepoContentTable(root + 1); });
  }
  foldername = false;
}

function random(min, max) {
  "use strict";
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initDisTime() {
  "use strict";
  var userLang = (navigator.language) ? navigator.language : navigator.userLanguage,
    config = {'lang' : userLang, 'time' : '60*60*24', 'detail' : false},
    hash = window.location.hash.replace('#', '').split('&'),
    i;
  for (i = 0; i < hash.length; i++) {
    config[hash[i].split('=')[0]] = hash[i].split('=')[1];
  }
  disTime(0, config.lang, parseInt(config.detail, 10));
}

majaX({url: apiurl, method: 'GET'}, function (json) {
  "use strict";
  repos = json;
  buildRepoTable();
});
