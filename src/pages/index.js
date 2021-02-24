import Bbx from '../components/Bbox';
import CustomBox from '../components/CustomBox';
import Points from '../components/Points'
import GradientMesh from '../components/GradientMesh'
import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      {/* <Bbx /> */}
      {/* <CustomBox /> */}
      {/* <Points /> */}
      <GradientMesh />
    </div>
  );
}
