import styles from './index.css';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      {/* <div style={{marginTop:20,fontWeight:600}}>娃娃劲舞</div> */}
      {props.children}
    </div>
  );
}

export default BasicLayout;
