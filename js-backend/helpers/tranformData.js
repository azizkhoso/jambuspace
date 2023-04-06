const transformDataInNestedStructure = (data) => {
  const nodesById = {};
  const roots = [];

  data.forEach((item) => {
    nodesById[item._id] = {
      ...item.toJSON(),
      replies: [],
    };

    if (item.parentCommentID === null) {
      roots.push(nodesById[item._id]);
    }
  });

  data.forEach((item) => {
    const node = nodesById[item._id];
    if (item.parentCommentID === null) {
      return;
    }
    const parent = nodesById[item.parentCommentID];
    if (parent) {
      parent.replies.push(node);
    }
  });

  data.forEach((item) => {
    if (nodesById[item._id].replies.length === 0) {
      delete nodesById[item._id].replies;
    }
  });

  return roots;
};

module.exports = transformDataInNestedStructure;
