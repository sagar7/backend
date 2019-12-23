const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const { User, validate } = require("../models/user");
/**
 * Register/Add new  user
 **/

router.post("/addUser", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already exist!");

  user = new User(_.pick(req.body, ["name", "email", "password", "role"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  // const token = user.generateAuthToken();
  // res.header("x-auth-token", token).send(user);
});
/**
 * getAll user
 **/
router.get("/all-user", [auth], async (req, res) => {
  const user = await User.find({}).select("-password");
  res.status(200).send(user);
});


/*
Edit User
 */
router.put("/user/:id", [auth], async (req, res) => {
  console.log(req.params.id,req.body.i_d)
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.user.role === "Admin"|| req.params.id==req.user._id) {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
      },
      { new: true }
    );
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(user);
  } else {
    res.status(400).send("Not enough permission!");
  }
});
/*
delete the user
*/
router.delete("/user/:id", [auth], async (req, res) => {
  if (req.user.role == "Admin") {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user)
      return res.status(404).send("The user with the given ID was not found.");

    res.send(user);
  } else {
    res.status(400).send("Not enough Permission!");
  }
});
//validateObjectId
router.get("/user/:id",validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select("-__v");
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

module.exports = router;
