import React from 'react'
import PostLeft from '../PostLeft'
import PostRight from '../PostRight'

const PostBlock = () => {
  return (
    <>
        <div className="clearfix pt-3" />
        <div className="row home-newsfeatured">
            <PostLeft />
            <PostRight />
        </div>
    </>
  )
}

export default PostBlock
