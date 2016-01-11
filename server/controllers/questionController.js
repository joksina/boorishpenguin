var db = require('../db/index.js');

module.exports = {
  allQuestions: function(req, res) {
    console.log('request to get all question')
    db.Post.findAll({
      where: {
        isAnAnswer: false
      },
      include: [db.User, db.Course, db.Tag]
    })
    .then(function(questions) {
      var formattedQs = questions.map(function(question) {
        return {
          id: question.id,
          text: question.text,
          isAnAnswer: false,
          points: question.points,
          responses: question.responses,
          isAnswered: question.isAnswered,
          isGood: question.isGood,
          isClosed: question.isClosed,
          createdAt: question.createdAt,
          coursename: question.Course.name,
          tagname: question.Tag.name,
          user: question.User.name
        }
      });

      questions = {};
      questions.results = formattedQs;
      res.json(questions);
    });
  },

  newQuestion: function(req, res) {
    var txt = req.body.text;
    var uname = req.body.username;
    var coursename = req.body.course;
    var tagname = req.body.tag;

    db.User.findOne({
      where: {
        username: uname
      }
    })
    .then(function(user) {
      user.update({
        points: user.points + 1
      })
      .then(function() {
        db.Course.findOne({
          where: {
            name: coursename
          }
        })
        .then(function(course) {
          db.Tag.findOne({
            where: {
              name: tagname
            }
          })
          .then(function(tag) {
            db.Post.create({
              text: txt,
              UserId: user.id,
              CourseId: course.id,
              TagId: tag.id
            })
            .then(function(question) {
              res.status(201).json(question);
            });
          });
        });
      })
    });
  },

  // TODO: add check for admin or same-user
  deleteQuestion: function(req, res) {
    var qid = req.body.id_question;

    db.Post.findById(qid)
    .then(function(question) {
      var uid = question.UserId;

      db.User.findById(uid)
      .then(function(user){
        // MAKE CHECK AROUND THIS CHAIN HERE

        user.update({
          points: user.points - 1
        })
        .then(function() {
          question.destroy()
          .then(function(id) {
            if (id) {
              res.sendStatus(204);
            };
          });
        });
        // END CHAIN
      })
    }) 
  },

  readQuestion: function(req, res) {
    var qid = req.params.id;

    db.Post.findById(qid, {
      include: [db.User, db.Course, db.Tag]
    })
    .then(function(question) {
      var formattedQ = [{
        id: question.id,
        text: question.text,
        isAnAnswer: false,
        points: question.points,
        responses: question.responses,
        isAnswered: question.isAnswered,
        isGood: question.isGood,
        isClosed: question.isClosed,
        createdAt: question.createdAt,
        coursename: question.Course.name,
        tagname: question.Tag.name,
        user: question.User.name
      }];

      db.Post.findAll({
        where: {
          QuestionId: qid
        },
        include: [db.User]
      })
      .then(function(answers) {
        var formattedAs = answers.map(function(answer) {
          return {
            id: answer.id,
            text: answer.text,
            isAnAnswer: true,
            points: answer.points,
            isGood: answer.isGood,
            QuestionId: qid,
            user: answer.User.name,
            createdAt: answer.createdAt
          }
        });

        qAndAs = {};
        qAndAs.results = formattedQ.concat(formattedAs);
        res.json(qAndAs);
      })
    })
  },

  // TODO: add check for admin or same-user
  modQuestion: function(req, res) {
    var qid = req.params.id;
    var mod = req.body.mod;

    db.Post.findOne({
      where: {
        id: qid
      }
    })
    .then(function(question) {
      var curGood = question.isGood;
      var curLike = question.points;
      var curClosed = question.isClosed;
      var curAnswered = question.isAnswered;

      db.User.findOne({
        where: {
          id: question.UserId
        }
      })
      .then(function(user) {
        // anybody can like; doesn't need auth
        if (mod === 'like') {
          question.getVote({where: ['UserId='+user.id+' AND PostId='+question.id]})
          .then(function(result) {
            if (!result.length) {
              return question.addVote(user)
              .then(function() {
                return question.update({
                  points: question.points + 1
                });
              })
              .then(function(question) {
                return user.update({
                  points: user.points + 1
                });
              });
            } else {
              return question.removeVote(user)
              .then(function() {
                return question.update({
                  points: question.points - 1
                });
              })
              .then(function(question) {
                return user.update({
                  points: user.points -1
                });
              });
            }
          })
          .then(function() {
            res.status(201).json(question);
          });
        } else if (mod === 'good') {
          // admin only
          question.update({
            isGood: !curGood
          })
          .then(function() {
            return user.update({
              points: user.points + 1
            })
          })
          .then(function() {
            res.status(201).json(question);
          });
        } else if (mod === 'closed') {
          // admin only; maybe refactor this and the previous
          // to run the admin check first?
          question.update({
            isClosed: !curClosed
          })
          .then(function() {
            res.status(201).json(question);
          });
        } else if (mod === 'answered') {
          // same-user only
          question.update({
            isAnswered: !curAnswered
          })
          .then(function() {
            res.status(201).json(question);
          })
        }
      });
    });
  }
};