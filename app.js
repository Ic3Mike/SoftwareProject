const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      helmet         = require("helmet"),
      flash          = require("connect-flash"),
      session        = require("express-session"),
      moment         = require("moment"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      User           = require("./models/user");

// requiring routes     
const indexRoute      = require("./routes/index"),
      campgroundRoute = require("./routes/campgrounds"),
      commentRoute    = require("./routes/comments"),
      userRoute       = require("./routes/user"),
      passwordRoute   = require("./routes/password");


// connect to the DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://mbllako20:3E2e6d051e@cluster0.ujphyro.mongodb.net/CampAl?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



  require('dotenv').config()
 console.log(process.env.APISECRET)

app.set("view engine", "ejs");
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = moment; // create local variable available for the application

//passport configuration
app.use(session({
  secret: 'Admin124',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass currentUser to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// use routes
app.use("/", indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use("/users", userRoute);
app.use("/", passwordRoute);

app.listen(3000, () => console.log("The OffRoad Server Has Started!"));