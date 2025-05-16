import { AnimatedTestimonials } from "~/components/animated-testimonials";

function Page() {
  const testimonials = [
    {
      quote:
        "From foundational concepts to future-forward innovations, we bring you the complete spectrum of technological knowledge, all in one place.",
      name: "Tech",
      designation: "TECHNOLOGY",
      src: "https://www.kindpng.com/picc/m/488-4887037_technology-transparent-background-information-technology-images-png-png.png",
      link: "/rss/tech",
    },
    {
      quote:
        "Discover your next favorite piece of tech: We bring you in-depth looks at the hottest product releases and hidden gems",
      name: "Product",
      designation: "PRODUCT",
      src: "https://cdn.shopify.com/s/files/1/1246/6441/articles/Product_Knowledge.png",
      link: "/rss/product",
    },
    {
      quote:
        "Mastering the art and science of modern marketing in the digital age – we deliver the tech-driven insights you need to thrive.",
      name: "ROI",
      designation: "ROI",
      src: "https://imageio.forbes.com/specials-images/imageserve/670822054af3806cee6ae8f3/0x0.jpg?format=jpg",
      link: "/rss/roi",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}

export default Page;
