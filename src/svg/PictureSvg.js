function SvgIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path fill={props.color ? props.color : "#2A3F54"} d="M163.7 52c-3 .9-8.5 4.8-11.7 8.2-1.1 1.2-4.2 8.9-7 17.2-13.7 41.1-15.2 44.1-24.5 48.6-3.9 1.9-6.2 2-39.6 2-38.6 0-41.8.4-52.9 5.8-7.1 3.5-18.7 15.1-22.2 22.2C-.3 168.3 0 162.2 0 293.6c0 77.1.4 122.1 1 125.5 3.7 19.4 20.4 36.3 39.9 40.5 9.9 2.1 420.3 2.1 430.2 0 19.5-4.2 36.2-21.1 39.9-40.5.6-3.4 1-48.4 1-125.5 0-131.4.3-125.3-5.8-137.6-3.5-7.1-15.1-18.7-22.2-22.2-11.1-5.4-14.3-5.8-52.9-5.8-33.4 0-35.7-.1-39.6-2-9.3-4.5-10.8-7.5-24.6-48.7-5.3-15.9-6.6-18-14.3-23.2l-4-2.6-91-.2c-50.1-.1-92.4.2-93.9.7zm113.8 103.6c34.2 5.9 64.3 25.2 83.9 53.8 24.4 35.7 29.2 79.9 13.1 120.2-16.2 40.2-53.3 70.3-96 77.9-11.7 2.1-33.3 2.1-45 0-42.7-7.6-79.8-37.7-96-77.9-16.1-40.3-11.3-84.5 13.1-120.2 19.3-28.2 49.4-47.7 82.9-53.7 11-2 32.9-2.1 44-.1zm175 26.6c8.3 5.6 10.6 16.5 5.3 24.5-3 4.6-9.6 8.3-14.6 8.3-3.8 0-9.7-2.3-12.6-4.8-2.7-2.4-5.6-9.1-5.6-13.2 0-7.4 5.5-14.7 12.8-17.1 4-1.3 11.2-.2 14.7 2.3z" />
      <path fill={props.color ? props.color : "#2A3F54"} d="M239.5 206.6c-3.8.8-11.7 3.8-17.5 6.6-9.3 4.5-11.5 6.1-20 14.7-8.2 8.2-10.3 11-14.3 19.1-6.1 12.4-8 20.7-8 34.5-.1 13.1 1.7 21.4 7.2 32.9 9.1 19.3 26.4 34.4 47.1 40.8 6.4 2 9.6 2.3 22 2.3s15.6-.3 22-2.3c20.7-6.4 38-21.5 47.1-40.8 5.5-11.5 7.3-19.8 7.2-32.9 0-13.8-1.9-22.1-8-34.5-4-8.1-6.1-10.9-14.3-19.1-8.5-8.6-10.7-10.2-20-14.7-6.4-3.1-13.5-5.7-18.2-6.6-9.5-2-23-1.9-32.3 0z" />
    </svg>
  );
}

export default SvgIcon;
