import Layout from '../../components/elements/Layout'
import Spline from '@splinetool/react-spline'


function TestPage() {
  return (
    <Layout className="relative min-h-screen bg-paper text-ink">
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="mb-6 font-display text-3xl sm:text-4xl">Spline Test</h1>
        <div className="mx-auto h-[58vh] min-h-[340px] w-full max-w-4xl overflow-hidden">
          <Spline scene="
https://prod.spline.design/Ugd7RiRIG6vZP4yc/scene.splinecode
" />
        </div>
      </section>
    </Layout>
  )
}

export default TestPage
