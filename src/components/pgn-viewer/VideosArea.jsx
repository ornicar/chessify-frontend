import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { VIDEOS_COUNT_PER_PAGE } from '../../constants/cloud-params';

const VideosArea = ({ loading, videos, getVideos }) => {
  const [showRange, setShowRange] = useState(VIDEOS_COUNT_PER_PAGE);

  useEffect(() => {
    if (!videos.length) getVideos();
  }, [videos.length]);

  if (loading)
    return (
      <div className="title rbt-section-title">
        <h6 className="text-center">Loading videos...</h6>
      </div>
    );

  return (
    <div className="view-more-btn text-center">
      <div className="row mt--10">
        {videos.slice(showRange - 4, showRange).map((vid) => (
          <div className="col-6 mt--10">
            <ReactPlayer
              url={`${vid.url}?t=${vid.msec / 1000}`}
              height={250}
              width="100%"
            />
          </div>
        ))}
      </div>
      <div className="pgn-viewer-footer mt--10">
        {showRange !== VIDEOS_COUNT_PER_PAGE && (
          <button onClick={() => setShowRange(showRange - 4)}>
            <IoIosArrowBack />
          </button>
        )}
        {showRange + 4 <= videos.length && (
          <button onClick={() => setShowRange(showRange + 4)}>
            <IoIosArrowForward />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideosArea;
