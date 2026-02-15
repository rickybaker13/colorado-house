'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Durango() {
  return (
    <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ position: 'relative', height: '75vh', overflow: 'hidden' }}>
        <Image
          src="/images/durango-downtown-main.jpg"
          alt="Historic Main Avenue in downtown Durango, Colorado"
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
        }} />
        <div style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 1.5rem',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.7)', marginBottom: '1rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              Elevation 6,512 ft &middot; Animas River Valley
            </p>
            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 300,
              color: '#fff', marginBottom: '1rem', lineHeight: 1.05,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              Durango
            </h1>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'rgba(255,255,255,0.85)', maxWidth: '36rem', margin: '0 auto',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              Historic railroad town, gateway to the San Juan Mountains
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview with downtown photo */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <motion.div {...fadeInUp} style={{
            display: 'grid', gridTemplateColumns: '1fr', gap: '3rem',
          }}>
            <div style={{ maxWidth: '52rem' }}>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '0.25em',
                color: '#c4956a', marginBottom: '1.25rem',
              }}>
                Founded 1880
              </p>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300,
                color: '#1a1a2e', marginBottom: '2rem', lineHeight: 1.15,
              }}>
                A town shaped by the railroad and the river
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                  color: '#4a4540', lineHeight: 1.75,
                }}>
                  Durango was founded in 1880 by the Denver &amp; Rio Grande Railroad as a
                  smelting hub for the silver mines of the San Juan Mountains. Sitting at
                  6,512 feet along the Animas River, the town quickly grew into the cultural
                  and commercial heart of southwestern Colorado. Its downtown, now a
                  National Historic District, still wears its Victorian-era architecture
                  with pride — iron-front buildings, arched windows, and awning-covered
                  sidewalks line Main Avenue much as they did over a century ago.
                </p>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                  color: '#4a4540', lineHeight: 1.75,
                }}>
                  Today Durango balances that heritage with a thriving outdoor culture.
                  Craft breweries and farm-to-table restaurants fill the historic
                  storefronts. The Animas River runs through the center of town, offering
                  Class II through IV rafting from spring snowmelt through late summer. Over
                  1,000 miles of singletrack radiate into the surrounding mountains, making
                  the area one of the top mountain-biking destinations in the West.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Downtown photo strip */}
          <motion.div {...fadeInUp} style={{
            marginTop: '3rem',
            position: 'relative', borderRadius: '0.5rem', overflow: 'hidden',
            height: 'clamp(16rem, 30vw, 22rem)',
          }}>
            <Image
              src="/images/durango-downtown-winter.jpg"
              alt="Downtown Durango under clear blue winter skies"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 72rem"
              quality={85}
            />
          </motion.div>
          <motion.p {...fadeInUp} style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
            color: '#9a9590', marginTop: '0.75rem', textAlign: 'right',
            fontStyle: 'italic',
          }}>
            Main Avenue, downtown Durango &middot; Photo: Durango Web Creations / CC BY-SA 3.0
          </motion.p>
        </div>
      </section>

      {/* The Train */}
      <section style={{ backgroundColor: '#f5f0eb', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <motion.div {...fadeInUp}>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.25em',
              color: '#c4956a', marginBottom: '1.25rem',
            }}>
              National Historic Landmark
            </p>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300,
              color: '#1a1a2e', marginBottom: '2rem', lineHeight: 1.15,
            }}>
              Durango &amp; Silverton Narrow Gauge Railroad
            </h2>
          </motion.div>
          <motion.div {...fadeInUp} style={{
            display: 'grid', gridTemplateColumns: '1fr', gap: '3rem',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                color: '#4a4540', lineHeight: 1.75,
              }}>
                Built in 1882 to haul silver and gold ore from the mines above
                Silverton, the narrow-gauge railroad has run continuously for over 140
                years. The coal-fired steam locomotives follow the Animas River through
                a wilderness canyon that is inaccessible by road, climbing from 6,512
                feet at the Durango depot to 9,318 feet in Silverton — a 45-mile
                journey each way.
              </p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                color: '#4a4540', lineHeight: 1.75,
              }}>
                Designated a National Historic Landmark, the railroad is one of the
                most photographed trains in North America. The route passes through the
                San Juan National Forest and the Weminuche Wilderness, offering views of
                sheer granite walls, cascading waterfalls, and alpine meadows. Round-trip
                excursions run daily from May through October, with holiday and winter
                service on shorter routes.
              </p>
            </div>

            {/* Quick Facts card */}
            <div style={{
              backgroundColor: '#fafaf8', padding: '2rem',
              borderRadius: '0.5rem',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1.5rem',
            }}>
              {[
                { label: 'Built', value: '1882' },
                { label: 'Distance', value: '45 miles one way' },
                { label: 'Elevation gain', value: '2,806 ft' },
                { label: 'Gauge', value: '3 ft narrow gauge' },
                { label: 'Designation', value: 'National Historic Landmark' },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem',
                    textTransform: 'uppercase', letterSpacing: '0.15em',
                    color: '#9a9590', marginBottom: '0.35rem',
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontFamily: '"Cormorant Garamond", serif', fontSize: '1.35rem',
                    fontWeight: 500, color: '#1a1a2e',
                  }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mesa Verde with photos */}
      <section style={{ padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <motion.div {...fadeInUp}>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.25em',
              color: '#c4956a', marginBottom: '1.25rem',
            }}>
              UNESCO World Heritage Site &middot; 45 min from Durango
            </p>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300,
              color: '#1a1a2e', marginBottom: '2rem', lineHeight: 1.15,
            }}>
              Mesa Verde National Park
            </h2>
          </motion.div>

          {/* Photo grid */}
          <motion.div {...fadeInUp} style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem', marginBottom: '2.5rem',
          }}>
            <div style={{
              position: 'relative', borderRadius: '0.5rem', overflow: 'hidden',
              aspectRatio: '4/3',
            }}>
              <Image
                src="/images/mesa-verde-cliff-dwelling.jpg"
                alt="Ancestral Puebloan cliff dwelling at Mesa Verde National Park"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 36rem"
                quality={85}
              />
            </div>
            <div style={{
              position: 'relative', borderRadius: '0.5rem', overflow: 'hidden',
              aspectRatio: '4/3',
            }}>
              <Image
                src="/images/mesa-verde-cliff-palace.jpg"
                alt="Cliff Palace at Mesa Verde — the largest cliff dwelling in North America"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 36rem"
                quality={85}
              />
            </div>
          </motion.div>

          <motion.div {...fadeInUp} style={{
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
            maxWidth: '52rem',
          }}>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: '#4a4540', lineHeight: 1.75,
            }}>
              Just 35 miles west of Durango, Mesa Verde National Park preserves
              nearly 5,000 archaeological sites, including 600 cliff dwellings built
              by the Ancestral Puebloan people between the sixth and thirteenth
              centuries. The park is a UNESCO World Heritage Site and one of the most
              significant archaeological preserves in the United States.
            </p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: '#4a4540', lineHeight: 1.75,
            }}>
              Cliff Palace, the largest cliff dwelling in North America, contains 150
              rooms and 23 kivas. Ranger-led tours take visitors onto the alcove
              ledges and into the structures themselves. The drive from Durango takes
              roughly 45 minutes, making it an easy day trip from town or from the
              Purgatory area.
            </p>
          </motion.div>

          {/* Mesa Verde Quick Info */}
          <motion.div {...fadeInUp} style={{
            marginTop: '2.5rem',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { label: 'Distance from house', value: '~1 hr 15 min' },
              { label: 'Established', value: '1906' },
              { label: 'Cliff dwellings', value: '600+' },
              { label: 'Best season', value: 'May – October' },
            ].map((item) => (
              <div key={item.label} style={{
                backgroundColor: '#f5f0eb', borderRadius: '0.5rem',
                padding: '1.25rem 1.5rem',
              }}>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  color: '#9a9590', marginBottom: '0.25rem',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: '"Cormorant Garamond", serif', fontSize: '1.35rem',
                  fontWeight: 500, color: '#1a1a2e',
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* San Juan Skyway + Activities */}
      <section style={{ backgroundColor: '#f5f0eb', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <motion.div {...fadeInUp} style={{ marginBottom: '3.5rem' }}>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.25em',
              color: '#c4956a', marginBottom: '1.25rem',
            }}>
              Scenic Drives &amp; Outdoor Recreation
            </p>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300,
              color: '#1a1a2e', lineHeight: 1.15,
            }}>
              Adventures in every direction
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
          }}>
            {[
              {
                title: 'San Juan Skyway',
                text: 'This 230-mile scenic loop connects Durango, Silverton, Ouray, Telluride, and Cortez. The stretch between Silverton and Ouray — the Million Dollar Highway — is one of the most dramatic mountain roads in the country, carved into sheer cliff faces above 10,000 feet.',
              },
              {
                title: 'River Rafting',
                text: 'The Animas River runs right through downtown Durango, offering Class II float trips for families and Class III–IV whitewater for experienced paddlers. Several outfitters operate guided half-day and full-day trips from May through September.',
              },
              {
                title: 'Mountain Biking',
                text: 'With over 1,000 miles of singletrack in the surrounding mountains, Durango has hosted multiple national and world mountain-biking championships. Trails range from smooth riverside paths to technical alpine descents with thousands of feet of elevation change.',
              },
              {
                title: 'Purgatory Resort',
                text: 'Just 25 miles north of downtown, Purgatory offers over 1,500 skiable acres in winter and an alpine coaster, mountain biking park, and summer activities the rest of the year. The drive from Durango takes about 30 minutes along US Highway 550.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.75rem', fontWeight: 400,
                  color: '#1a1a2e', marginBottom: '1rem',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
                  color: '#4a4540', lineHeight: 1.75,
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', height: '55vh', overflow: 'hidden' }}>
        <Image
          src="/images/alpenglow-sunset.jpg"
          alt="Alpenglow over the San Juan Mountains near Durango"
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2), rgba(0,0,0,0.1))',
        }} />
        <div style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'flex-end', textAlign: 'center',
          paddingBottom: 'clamp(3rem, 6vw, 6rem)', padding: '0 1.5rem',
        }}>
          <motion.div {...fadeInUp}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300,
              color: '#fff', marginBottom: '1rem', lineHeight: 1.15,
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              Stay at the base of the mountains
            </h2>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              color: 'rgba(255,255,255,0.8)', marginBottom: '2rem',
              maxWidth: '32rem', margin: '0 auto 2rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              Our Purgatory townhouse puts you 25 miles from Durango and steps from
              the ski lifts.
            </p>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center',
            }}>
              <Link
                href="/"
                style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '0.9rem 2.5rem', border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff', borderRadius: '9999px', textDecoration: 'none',
                  transition: 'all 0.3s',
                }}
              >
                Back to Home
              </Link>
              <Link
                href="/booking"
                style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '0.9rem 2.5rem', backgroundColor: '#fff',
                  color: '#1a1a2e', borderRadius: '9999px', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'all 0.3s',
                }}
              >
                Book Your Stay
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
