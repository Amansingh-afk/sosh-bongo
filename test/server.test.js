const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server/server");
const User = require("../server/models/userModel");
const Blog = require("../server/models/blogModel");
const jwt = require("jsonwebtoken");

const should = chai.should();
chai.use(chaiHttp);

describe("User", () => {
  after(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
  });

  describe("/POST Create user", () => {
    it("should register a new user", (done) => {
      const user = {
        name: "Test User",
        email: "testuser@example.com",
        password: "testpassword",
      };
      chai
        .request(server)
        .post("/api/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.savedUser.should.have.property("name").eql("Test User");
          res.body.savedUser.should.have
            .property("email")
            .eql("testuser@example.com");
          res.headers.should.have.property("set-cookie");
          done();
        });
    });
  });

  describe("/POST loginUser", () => {
    it("should login an existing user", (done) => {
      const user = {
        email: "testuser@example.com",
        password: "testpassword",
      };
      chai
        .request(server)
        .post("/api/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("token");
          res.body.user.should.have.property("name").eql("Test User");
          done();
        });
    });
  });
});

describe("Blogs", () => {
  let token, user, blog;

  before(async () => {
    // Create a user to use for testing
    user = new User({
      name: "sosh",
      email: "testuser@example.com",
      password: "password",
    });
    await user.save();

    // Generate a JWT for the user
    token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

     // Create a blog to use for testing
     blog = new Blog({
      title: "Test Blog",
      description: "This is a test blog post",
      createdBy: user._id,
    });
    await blog.save();
  });

  after(async () => {
    // Clean up after tests
    await User.deleteMany();
    await Blog.deleteMany();
  });

  describe("/POST blog", () => {
    it("should not POST a blog if user is not logged in", async () => {
      const blog = {
        title: "Test Blog",
        description: "This is a test blog post",
      };

      const res = await chai.request(server).post("/api/blog").send(blog);
      res.should.have.status(401);
      res.body.should.be.a("object");
      res.body.should.have
        .property("msg")
        .eql("Access denied. No token provided");
    });

    it("should POST a blog if user is logged in", async () => {
      const blog = {
        title: "Test Blog",
        description: "This is a test blog post",
      };

      const res = await chai
        .request(server)
        .post("/api/blog")
        .set("Cookie", `token=${token}`)
        .send(blog);
      res.should.have.status(201);
      res.body.should.be.a("object");
      res.body.data.should.have.property("title").eql("Test Blog");
      res.body.data.should.have.property("description").eql("This is a test blog post");
    });
  });

  describe("/PUT/:id blog", () => {
    it("should not UPDATE a blog if user is not logged in", async () => {
      const updateBlog = {
        title: "Updated Test Blog",
        description: "This is an updated test blog post",
      };

      const res = await chai
        .request(server)
        .put(`/api/blog/${blog._id}`)
        .send(updateBlog);
      res.should.have.status(401);
      res.body.should.be.a("object");
      res.body.should.have
        .property("msg")
        .eql("Access denied. No token provided");
    });

    it("should UPDATE a blog if user is logged in", async () => {
      const updateBlog = {
        title: "Updated Test Blog",
        description: "This is an updated test blog post",
      };

      const res = await chai
        .request(server)
        .put(`/api/blog/${blog._id}`)
        .send(updateBlog);
      res.should.have.status(401);
      res.body.should.be.a("object");
      res.body.should.have
        .property("msg")
        .eql("Access denied. No token provided");
    });
  });

  describe("/DELETE/:id blog", () => {
    it("should not DELETE a blog if user is not logged in", async () => {
      const res = await chai
        .request(server)
        .delete(`/api/blog/${blog._id}`)
      res.should.have.status(401);
      res.body.should.be.a("object");
      res.body.should.have
        .property("msg")
        .eql("Access denied. No token provided");
    });

    it("should DELETE a blog if user is logged in", async () => {
      const res = await chai
        .request(server)
        .delete(`/api/blog/${blog._id}`)
        .set("Cookie", `token=${token}`)
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have
        .property("msg")
        .eql("Blog post deleted successfully");
    });
  });
});
