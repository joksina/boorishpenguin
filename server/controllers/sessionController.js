/**
 * Created by hridhya on 1/12/16.
 */
var db = require('../db/index.js');
var UCtrl = require('./userControllers.js');

var date = new Date();

module.exports = {
    newSession: function(req, res){

        var coursename = req.body.course;
        console.log(coursename);
        var time = req.body.time;
        var uid = req.body.id_user;

        db.User.findById(uid)
            .then(function(user) {
                console.log(user.email);
                user.update({
                        points: user.points + 1
                    })
                    .then(function() {
                        db.Session.create({
                            UserId: user.id,
                            Course: coursename,
                            Time: time
                        })
                            .then(function(question) {
                                res.status(201).json(question);
                            });
                    });
            });
    },

    allSessions: function(req, res){
        db.Session.findAll({
            where: {
                Time:{
                    gt: date
                }
            },
            include: [db.User]
        }).then(function(sessions){
            var formattedSs = sessions.map(function(session) {
                return {
                    id: session.id,
                    course: session.Course,
                    user: session.User.name,
                    time: session.Time
                }
            });

            sessions = {};
            sessions.results = formattedSs;
            res.json(sessions);

        })

    },

    addSessionQuestion: function(req, res){

        var question =  req.body. sessionQ;
        var sessionID = req.body.id_session;
        var userID = req.body.id_user;

        db.Session.findById(sessionID)
            .then(function(session) {
                db.SessionQ.create({
                    UserId: userID,
                    Question: question,
                    SessionId: session.id
                })
                    .then(function(question) {
                        res.status(201).json(question);
                    });
            });
    },

    readSession: function(req, res) {
        var qid = req.params.id;

        db.Session.findById(qid, {
                include: [db.User]
            })
            .then(function(session) {
                var formattedS = [{id: session.id, user: session.User.name, course: session.Course, time: session.Time}];

                db.SessionQ.findAll({
                        where: {
                            SessionId: qid
                        },
                        include: [db.User]
                    })
                    .then(function(questions) {
                        var formattedQs = questions.map(function(question) {
                            return {
                                id: question.id,
                                text: question.Question,
                                SessionId: qid,
                                //user: question.User.name,
                                //userid: question.User.id,
                                createdAt: question.createdAt
                                //imgUrl: question.User.picture
                            }
                        });

                        qAndAs = {};
                        qAndAs.results = formattedS.concat(formattedQs);
                        res.json(qAndAs);
                    })
            })
    }

};



