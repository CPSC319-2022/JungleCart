import { getSortedPostsData } from '../../../lib/posts';
import ReactMarkdown from 'react-markdown';
import styles from './logs.module.scss';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
}

export default function Blog({ allPostsData }) {
  const post = ({ id, date, title, content }) => {
    let style = '';
    if (id === 'gettingstarted') {
      style = 'border-primary  border-2 rounded-md  ';
    }

    return (
      <div
        key={id}
        className={`card w-full  bg-base-100 mb-3 shadow-md ${style}`}
      >
        <div className="card-body">
          <h3 className="card-title p-0 m-0">{title}</h3>
          <h6 className={'p-0 mt-0'}>{date}</h6>

          <div id="write">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div
      className={'w-full flex justify-center bg-gray-light p-0'}
      id={styles.write}
    >
      <div className={'max-w-3xl'}>
        <section className="card max-w-6xl flex w-full  ">
          <h2 className="text-3xl ">Release Logs</h2>
          {allPostsData.map(({ id, date, title, content }) =>
            post({ id, date, title, content })
          )}
        </section>
      </div>
    </div>
  );
}
//
