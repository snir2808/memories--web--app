import React, { useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./CommentSection";
import moment from "moment";
import useStyles from "./style";

const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({ search: "none", tags: post?.tags.join(",") })
      );
    }
  }, [post]);

  if (!post) return null;

  if (isLoading) {
    return (
      <Paper elevation={8} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts?.filter(({ _id }) => _id !== post._id);

  const openPost = (_id) => history.push(`/posts/${_id}`);

  return (
    <Paper elevation={6} style={{ padding: "20px", borderRadius: "15px" }}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            className={classes.tag}
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider className={classes.divider} style={{ margin: "20px 0" }} />
          <CommentSection post={post} />
          <Divider className={classes.divider} style={{ margin: "20px 0" }} />
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={
              post.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={post.title}
          />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(
              ({ _id, title, message, name, likes, selectedFile }) => (
                <Paper
                  key={_id}
                  elevation={6}
                  style={{ margin: "5px", borderRadius: "15px" }}
                >
                  <div
                    style={{ margin: "20px", cursor: "pointer" }}
                    onClick={() => openPost(_id)}
                  >
                    <Typography gutterBottom variant="h6">
                      {title}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2">
                      {name}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2">
                      {message}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                      {/* Likes: {likes?.length} */}
                    </Typography>
                    <img src={selectedFile} width="200px" />
                  </div>
                </Paper>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default PostDetails;
