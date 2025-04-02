const home = async (req, res) => {
  const testimonials = [
    {
      name: "Sarah Williams",
      location: "New York, USA",
      // External image URL from Unsplash
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80",
      rating: 5,
      text: "The portrait captured my daughter's personality perfectly. Every time I look at it, I see something new. Truly an extraordinary talent!",
      // External artwork image
      artwork:
        "https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Michael Chen",
      location: "Toronto, Canada",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80",
      rating: 5,
      text: "I commissioned a piece for our anniversary, and it exceeded all expectations. The attention to detail and emotional depth is remarkable.",
      artwork:
        "https://images.unsplash.com/photo-1574182245530-967d9b3831af?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Elena Rodriguez",
      location: "Barcelona, Spain",
      image:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80",
      rating: 5,
      text: "Working with this artist was a wonderful experience from start to finish. They listened carefully to my vision and brought it to life beautifully.",
      artwork:
        "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  ];

  // Optional: Fetch services, FAQs, and contact info from database
  const services = [
    { id: "portrait", name: "Portrait Commission" },
    { id: "landscape", name: "Landscape Artwork" },
    { id: "abstract", name: "Abstract Piece" },
    { id: "illustration", name: "Custom Illustration" },
  ];

  // Contact information
  const contactInfo = {
    contactEmail: "artist@example.com",
    contactPhone: "+1 (555) 123-4567",
    studioAddress: "Art District, 123 Creative Lane, New York, NY 10001",
    studioImage:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    social: {
      instagram: "https://instagram.com/artistname",
      facebook: "https://facebook.com/artistname",
      twitter: "https://twitter.com/artistname",
      pinterest: "https://pinterest.com/artistname",
    },
  };

  const faqItems = [
    {
      question: "How long does a commission typically take?",
      answer:
        "The timeline varies depending on project complexity and my current workload. Small pieces generally take 2-3 weeks, while larger or more detailed commissions may take 4-8 weeks. I'll provide a specific timeline estimate when discussing your project.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! I ship artwork worldwide using insured and tracked shipping services. International shipping costs will be calculated based on your location and the size/weight of the artwork.",
    },
    {
      question:
        "What information should I include when requesting a commission?",
      answer:
        "Please share your vision, desired size, color palette preferences, intended display location, and timeline needs. Reference images are also very helpful! The more details you provide, the better I can bring your vision to life.",
    },
  ];
  res.render("gallery", {
    title: "San Arts",
    testimonials,
    services: services,
    faqItems: faqItems,
    ...contactInfo,
  });
};
module.exports = { home };
