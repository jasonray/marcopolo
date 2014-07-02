marcopolo
=========

Install It! (services)
======================

- Install oracle client [https://github.com/joeferner/node-oracle/blob/master/INSTALL.md]

- Ensure that you have node installed [http://nodejs.org/download/]

- Run `npm install`


Run it! (services)
==================
`./run.sh`

Health Check
------------
GET `/health`

List of ideas
-------------
GET `/ideas?user=userid`

Fetch single idea
-----------------
GET `/ideas/id/:id`

Create idea
-----------
POST `/ideas`
with body:
```
{
   "short_description": "some crazy idea",
   "long_description": "this idea is so crazy, that it just might work!"
}
```

Fetch voting for idea / user
----------------------------
GET `/ideas/id/:id/votingResult?user=userid`

Vote for an idea
----------------
POST `/ideas/id/:id/operations/voteYes`
POST `/ideas/id/:id/operations/voteNo`

Fetch tracking for idea / user
------------------------------
GET `ideas/id/:id/tracking`

Enable / disable tracking for idea / user
-----------------------------------------
POST `/ideas/id/:id/operations/track?user=userid`
POST `/ideas/id/:id/operations/untrack?user=userid`

Suspend idea
------------
POST `/ideas/id/:id/suspend`

Fetch comments
--------------
GET `/ideas/id/:id/comments`

Save comment
------------
POST `/ideas/id/:id/comments`
where body = comment text

