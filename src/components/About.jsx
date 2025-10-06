import BayerDitheringBackground from "./BayerDitheringBackground";

const About = () => {

  return (
    <div className="wrapper relative w-full min-h-[60vh] md:min-h-dvh bg-[#0a0a0f] pt-16 md:pt-0">
      <BayerDitheringBackground 
        shape="diamond" 
        pixelSize={3} 
        color="#5e9cdb"
        className="opacity-60"
      />
      <div className="content relative w-full overflow-x-hidden">
        <section className="section hero w-full h-[60vh] md:h-screen">
          {/* 静态图片作为后景 */}
          <div
            className="background-image w-full h-full absolute inset-0"
            style={{
              width: "90%",
              height: "100%",
              left: "5%",
              backgroundImage: "url(/img/586955.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              opacity: 0.8,
              borderRadius: "20px"
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default About;
