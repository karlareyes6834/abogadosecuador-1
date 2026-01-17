import React from 'react';
import { QuoteIcon } from './icons/InterfaceIcons';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ testimonials }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <QuoteIcon className="h-8 w-8 text-blue-500 mr-2" />
            <div className="flex text-yellow-400">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.898 3.445 1.43-8.314L.489 6.76l8.451-.98L10 0l1.561 5.78 8.451.98-4.043 3.771 1.43 8.314L10 15z" />
                </svg>
              ))}
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
            "{testimonial.content}"
          </p>
          
          <div className="flex items-center">
            {testimonial.imageUrl && (
              <img 
                src={testimonial.imageUrl} 
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsCarousel;