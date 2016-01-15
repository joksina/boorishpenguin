var Sequelize = require('sequelize');

var database = process.env.DATABASE || 'townhall';
var dbUser = process.env.DBUSER || 'root';
var dbPass = process.env.DBPASS || '';
var dbHost = process.env.DBHOST || 'localhost';

var db = new Sequelize(database, dbUser, dbPass, {
  host: dbHost
});

var User = db.define('User', {
  username: Sequelize.STRING,
  name: Sequelize.STRING,
  name_last: Sequelize.STRING,
  name_first: Sequelize.STRING,
  isTeacher: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  email: Sequelize.STRING,
  picture: Sequelize.STRING
}, {
  timestamps: false
});

var Tag = db.define('Tag', {
  name: Sequelize.STRING
}, {
  timestamps: false
});

var Course = db.define('Course', {
  name: Sequelize.STRING
}, {
  timestamps: false
});

var Session = db.define('Session',{
  Course: Sequelize.STRING,
  Time: Sequelize.DATE

});

var SessionQ = db.define('SessionQ',{
  Question: Sequelize.STRING
});

var Post = db.define('Post', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  isAnAnswer: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  responses: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isAnswered: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isGood: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isClosed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW')
  },
  updatedAt: Sequelize.DATE
});

var Like = db.define('Like', {
  }, {
    timestamps: false
});

Course.belongsToMany(User, {
  through: 'CourseUser'
});
User.belongsToMany(Course, {
  through: 'CourseUser'
});

User.hasMany(Session);
Session.belongsTo(User);

Session.hasMany(SessionQ);
SessionQ.belongsTo(Session);

User.hasMany(SessionQ);
SessionQ.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);
Tag.hasMany(Post);
Post.belongsTo(Tag);
Course.hasMany(Post);
Post.belongsTo(Course);
Post.hasMany(Post, {as: 'Responses', foreignKey: 'QuestionId'});

Post.belongsToMany(User, {as: 'Vote', through: 'Like'});
User.belongsToMany(Post, {through: 'Like'});

User.sync()
    .then(function() {
      return Tag.sync();
    })
    .then(function() {
      return Course.sync();
    })
    .then(function() {
      return Post.sync();
    })
    .then(function(){
      return Session.sync();
    })
    .then(function(){
      return SessionQ.sync();
    })
    .then(function(){
      return Like.sync();
    });

exports.User = User;
exports.Course = Course;
exports.Tag = Tag;
exports.Post = Post;
exports.Session = Session;
exports.SessionQ = SessionQ;
