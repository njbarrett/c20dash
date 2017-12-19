import Header from './Header'

const Layout = (props) => (
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
    <Header />
    {props.children}
  </div>
)

export default Layout
