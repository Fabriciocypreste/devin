/**
 * Script de teste para validar o sistema de pré-carregamento de imagens
 * 
 * Como usar no console do navegador:
 * 1. Abra o DevTools (F12)
 * 2. Vá para Console
 * 3. Cole este código e execute
 */

import { imagePreloader } from './imagePreloader';

export async function testImagePreloadSystem() {
  console.log('🧪 Starting Image Preload System Test...\n');

  // URLs de teste do TMDB
  const testUrls = [
    'https://image.tmdb.org/t/p/w342/kqjL17yufvn9OVLyXYpvtyrFfak.jpg', // Wednesday
    'https://image.tmdb.org/t/p/w342/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg', // The Witcher
    'https://image.tmdb.org/t/p/w342/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', // The Last of Us
  ];

  console.log('📋 Test URLs:', testUrls.length);
  
  // Test 1: Adicionar à fila
  console.log('\n🔬 Test 1: Adding images to queue...');
  testUrls.forEach((url, index) => {
    imagePreloader.add(url, 'high', 'poster');
    console.log(`  ✅ Added image ${index + 1} to queue`);
  });

  // Verificar stats
  let stats = imagePreloader.getStats();
  console.log('📊 Stats after adding:', stats);

  // Test 2: Aguardar processamento
  console.log('\n🔬 Test 2: Waiting for processing...');
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5 segundos

  stats = imagePreloader.getStats();
  console.log('📊 Stats after 5s:', stats);

  // Test 3: Obter URLs otimizadas
  console.log('\n🔬 Test 3: Getting optimized URLs...');
  for (const url of testUrls) {
    const optimized = await imagePreloader.getOptimizedUrl(url);
    console.log(`  🖼️ Original: ${url.substring(url.lastIndexOf('/') + 1)}`);
    console.log(`  ✨ Optimized: ${optimized.substring(0, 80)}...`);
  }

  // Test 4: Verificar cache
  console.log('\n🔬 Test 4: Cache verification...');
  stats = imagePreloader.getStats();
  console.log('📊 Final stats:', stats);

  if (stats.cached >= testUrls.length) {
    console.log('\n✅ SUCCESS: All images cached successfully!');
  } else {
    console.log('\n⚠️ WARNING: Some images not cached yet');
    console.log(`   Cached: ${stats.cached}/${testUrls.length}`);
  }

  // Test 5: Performance
  console.log('\n🔬 Test 5: Performance test...');
  const startTime = performance.now();
  await Promise.all(testUrls.map(url => imagePreloader.getOptimizedUrl(url)));
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`⚡ Retrieved ${testUrls.length} cached URLs in ${duration.toFixed(2)}ms`);
  console.log(`   Average: ${(duration / testUrls.length).toFixed(2)}ms per image`);

  if (duration < 100) {
    console.log('   ✅ Excellent performance! (<100ms)');
  } else if (duration < 500) {
    console.log('   ⚠️ Good performance (100-500ms)');
  } else {
    console.log('   ❌ Poor performance (>500ms) - check connection');
  }

  // Summary
  console.log('\n📋 Test Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Queue System: ${stats.queued === 0 ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Cache System: ${stats.cached >= testUrls.length ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Performance: ${duration < 500 ? 'PASS' : 'FAIL'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return stats;
}

/**
 * Teste de stress - carregar muitas imagens de uma vez
 */
export async function stressTest(count: number = 50) {
  console.log(`🏋️ Starting Stress Test with ${count} images...\n`);

  const testUrls = Array.from({ length: count }, (_, i) => 
    `https://image.tmdb.org/t/p/w342/test${i}.jpg`
  );

  console.log('📦 Adding all images to queue...');
  imagePreloader.addBatch(testUrls, 'medium', 'poster');

  console.log('⏱️ Monitoring for 30 seconds...\n');

  for (let i = 0; i < 6; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const stats = imagePreloader.getStats();
    const progress = ((stats.cached / count) * 100).toFixed(1);
    console.log(`[${i * 5}s] Progress: ${progress}% | Cached: ${stats.cached} | Processing: ${stats.processing} | Queued: ${stats.queued}`);
  }

  const finalStats = imagePreloader.getStats();
  console.log('\n📊 Final Results:');
  console.log(`   Total: ${count}`);
  console.log(`   Cached: ${finalStats.cached}`);
  console.log(`   Success Rate: ${((finalStats.cached / count) * 100).toFixed(1)}%`);

  return finalStats;
}

/**
 * Teste de memória - verificar uso de RAM
 */
export function memoryTest() {
  console.log('💾 Memory Usage Test\n');

  const stats = imagePreloader.getStats();
  
  console.log('📊 Cache Stats:');
  console.log(`   Items cached: ${stats.cached}`);
  console.log(`   Items queued: ${stats.queued}`);
  console.log(`   Items processing: ${stats.processing}`);
  
  // Estimar uso de memória (aproximado)
  const estimatedMemory = stats.cached * 0.1; // ~100KB por URL em cache
  console.log(`\n💾 Estimated Memory Usage: ~${estimatedMemory.toFixed(2)} MB`);

  if (estimatedMemory > 100) {
    console.log('   ⚠️ High memory usage - consider clearing cache');
    console.log('   Run: imagePreloader.clearCache()');
  } else {
    console.log('   ✅ Memory usage is acceptable');
  }

  return stats;
}

// Exportar para uso global no console
if (typeof window !== 'undefined') {
  (window as any).testImagePreload = testImagePreloadSystem;
  (window as any).stressTestImages = stressTest;
  (window as any).memoryTestImages = memoryTest;
  
  console.log('🧪 Test functions loaded! Available commands:');
  console.log('   testImagePreload()      - Run basic test suite');
  console.log('   stressTestImages(50)    - Stress test with N images');
  console.log('   memoryTestImages()      - Check memory usage');
}
