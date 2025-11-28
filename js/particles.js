// Enhanced Neural Network Effect for AI Studio
class EnhancedNeuralNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.neurons = [];
    this.connections = [];
    this.signals = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    this.time = 0;
    
    // Enhanced color palette
    this.colors = {
      neurons: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
      connections: '#667eea',
      signals: '#ffffff',
      glow: '#4facfe'
    };
    
    // Performance settings
    this.settings = {
      neuronCount: this.getOptimalNeuronCount(),
      maxConnections: 3,
      signalSpeed: 2,
      pulseIntensity: 0.3,
      interactionRadius: 120
    };
    
    this.init();
  }
  
  getOptimalNeuronCount() {
    const screenArea = window.innerWidth * window.innerHeight;
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) return Math.min(80, Math.floor(screenArea / 15000));
    return Math.min(150, Math.floor(screenArea / 8000));
  }
  
  init() {
    this.resizeCanvas();
    this.createNeuralNetwork();
    this.animate();
    
    // Event listeners
    window.addEventListener('resize', () => this.handleResize());
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // Используем ScrollManager для оптимизации прокрутки
    if (window.scrollManager) {
      this.scrollUnsubscribe = window.scrollManager.subscribe((scrollY) => {
        this.handleScroll();
      });
    } else {
      // Fallback для старых браузеров
      document.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  handleResize() {
    this.resizeCanvas();
    this.settings.neuronCount = this.getOptimalNeuronCount();
    this.createNeuralNetwork();
  }
  
  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }
  
  handleScroll() {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    this.settings.pulseIntensity = 0.2 + scrollPercent * 0.4;
  }
  
  createNeuralNetwork() {
    this.neurons = [];
    this.connections = [];
    this.signals = [];
    
    // Create neurons with different types
    for (let i = 0; i < this.settings.neuronCount; i++) {
      const neuron = this.createNeuron(i);
      this.neurons.push(neuron);
    }
    
    // Create intelligent connections
    this.createConnections();
  }
  
  createNeuron(index) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Create layered distribution (like real neural networks)
    const layer = Math.floor(index / (this.settings.neuronCount / 4));
    const angleStep = (Math.PI * 2) / (this.settings.neuronCount / 4);
    const angle = (index % (this.settings.neuronCount / 4)) * angleStep;
    
    const baseRadius = 100 + layer * 80;
    const radiusVariation = (Math.random() - 0.5) * 60;
    const radius = baseRadius + radiusVariation;
    
    const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
    const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100;
    
    return {
      id: index,
      x: Math.max(50, Math.min(this.canvas.width - 50, x)),
      y: Math.max(50, Math.min(this.canvas.height - 50, y)),
      baseX: x,
      baseY: y,
      size: Math.random() * 3 + 2,
      type: this.getNeuronType(layer),
      color: this.colors.neurons[layer % this.colors.neurons.length],
      activity: Math.random(),
      pulse: Math.random() * Math.PI * 2,
      connections: [],
      lastSignal: 0
    };
  }
  
  getNeuronType(layer) {
    const types = ['input', 'hidden', 'processing', 'output'];
    return types[layer % types.length];
  }
  
  createConnections() {
    this.neurons.forEach(neuron => {
      const nearbyNeurons = this.neurons
        .filter(other => other.id !== neuron.id)
        .map(other => ({
          neuron: other,
          distance: this.getDistance(neuron, other)
        }))
        .filter(item => item.distance < 200)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, this.settings.maxConnections);
      
      nearbyNeurons.forEach(item => {
        if (!this.connectionExists(neuron, item.neuron)) {
          const connection = {
            from: neuron,
            to: item.neuron,
            strength: Math.random() * 0.8 + 0.2,
            active: false,
            lastPulse: 0
          };
          
          this.connections.push(connection);
          neuron.connections.push(connection);
        }
      });
    });
  }
  
  connectionExists(neuron1, neuron2) {
    return this.connections.some(conn => 
      (conn.from.id === neuron1.id && conn.to.id === neuron2.id) ||
      (conn.from.id === neuron2.id && conn.to.id === neuron1.id)
    );
  }
  
  getDistance(point1, point2) {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + 
      Math.pow(point1.y - point2.y, 2)
    );
  }
  
  updateNeuralNetwork() {
    this.time += 0.016; // ~60fps
    
    // Update neurons
    this.neurons.forEach(neuron => {
      // Gentle floating movement
      neuron.pulse += 0.02;
      neuron.x += Math.sin(neuron.pulse) * 0.3;
      neuron.y += Math.cos(neuron.pulse * 0.7) * 0.2;
      
      // Mouse interaction - attraction/repulsion
      const mouseDistance = this.getDistance(neuron, this.mouse);
      if (mouseDistance < this.settings.interactionRadius) {
        const force = (this.settings.interactionRadius - mouseDistance) / this.settings.interactionRadius;
        const angle = Math.atan2(neuron.y - this.mouse.y, neuron.x - this.mouse.x);
        
        // Attraction for closer neurons, repulsion for very close ones
        const direction = mouseDistance < 60 ? 1 : -0.3;
        neuron.x += Math.cos(angle) * force * direction * 2;
        neuron.y += Math.sin(angle) * force * direction * 2;
        
        // Increase activity near mouse
        neuron.activity = Math.min(1, neuron.activity + force * 0.1);
      }
      
      // Return to base position
      const returnForce = 0.01;
      neuron.x += (neuron.baseX - neuron.x) * returnForce;
      neuron.y += (neuron.baseY - neuron.y) * returnForce;
      
      // Update activity (neural firing)
      neuron.activity *= 0.95; // Decay
      if (Math.random() < 0.005) {
        neuron.activity = Math.min(1, neuron.activity + 0.5);
        this.triggerSignal(neuron);
      }
    });
    
    // Update signals
    this.updateSignals();
    
    // Randomly trigger neural activity waves
    if (Math.random() < 0.01) {
      this.triggerActivityWave();
    }
  }
  
  triggerSignal(fromNeuron) {
    fromNeuron.connections.forEach(connection => {
      if (connection.from.id === fromNeuron.id && Math.random() < connection.strength) {
        this.signals.push({
          connection: connection,
          progress: 0,
          speed: this.settings.signalSpeed * (0.5 + Math.random() * 0.5),
          intensity: fromNeuron.activity,
          color: this.colors.signals
        });
      }
    });
  }
  
  updateSignals() {
    this.signals = this.signals.filter(signal => {
      signal.progress += signal.speed * 0.01;
      
      if (signal.progress >= 1) {
        // Signal reached destination
        signal.connection.to.activity = Math.min(1, signal.connection.to.activity + signal.intensity * 0.3);
        return false; // Remove signal
      }
      
      return true;
    });
  }
  
  triggerActivityWave() {
    const centerNeuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
    centerNeuron.activity = 1;
    
    // Spread activity to nearby neurons
    setTimeout(() => {
      this.neurons.forEach(neuron => {
        const distance = this.getDistance(centerNeuron, neuron);
        if (distance < 150) {
          const delay = distance * 2;
          setTimeout(() => {
            neuron.activity = Math.min(1, neuron.activity + 0.7);
          }, delay);
        }
      });
    }, 100);
  }
  
  draw() {
    // Clear with subtle fade effect
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections
    this.drawConnections();
    
    // Draw signals
    this.drawSignals();
    
    // Draw neurons
    this.drawNeurons();
  }
  
  drawConnections() {
    this.connections.forEach(connection => {
      const opacity = connection.strength * 0.3;
      const distance = this.getDistance(connection.from, connection.to);
      
      if (distance < 250) {
        this.ctx.save();
        this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = this.colors.connections;
        this.ctx.lineWidth = 1;
        
        // Add glow effect for active connections
        if (connection.from.activity > 0.5 || connection.to.activity > 0.5) {
          this.ctx.shadowBlur = 5;
          this.ctx.shadowColor = this.colors.glow;
          this.ctx.lineWidth = 1.5;
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(connection.from.x, connection.from.y);
        this.ctx.lineTo(connection.to.x, connection.to.y);
        this.ctx.stroke();
        
        this.ctx.restore();
      }
    });
  }
  
  drawSignals() {
    this.signals.forEach(signal => {
      const fromX = signal.connection.from.x;
      const fromY = signal.connection.from.y;
      const toX = signal.connection.to.x;
      const toY = signal.connection.to.y;
      
      const x = fromX + (toX - fromX) * signal.progress;
      const y = fromY + (toY - fromY) * signal.progress;
      
      this.ctx.save();
      this.ctx.globalAlpha = signal.intensity;
      
      // Create pulsing signal
      const pulseSize = 3 + Math.sin(this.time * 10) * 1;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, pulseSize);
      gradient.addColorStop(0, signal.color);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  
  drawNeurons() {
    this.neurons.forEach(neuron => {
      this.ctx.save();
      
      // Base neuron
      const baseOpacity = 0.6 + neuron.activity * 0.4;
      this.ctx.globalAlpha = baseOpacity;
      
      // Create neuron gradient
      const gradient = this.ctx.createRadialGradient(
        neuron.x, neuron.y, 0,
        neuron.x, neuron.y, neuron.size * 2
      );
      gradient.addColorStop(0, neuron.color);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      
      // Add glow for active neurons
      if (neuron.activity > 0.5) {
        this.ctx.shadowBlur = 10 + neuron.activity * 10;
        this.ctx.shadowColor = neuron.color;
      }
      
      // Draw neuron body
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, neuron.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw activity pulse
      if (neuron.activity > 0.3) {
        this.ctx.globalAlpha = neuron.activity * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(neuron.x, neuron.y, neuron.size * (1 + neuron.activity), 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
    });
  }
  
  animate() {
    this.updateNeuralNetwork();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousemove', this.handleMouseMove);
    // Отписываемся от событий прокрутки
    if (this.scrollUnsubscribe) {
      this.scrollUnsubscribe();
    }
    // Fallback для старых браузеров
    document.removeEventListener('scroll', this.handleScroll);
  }
}

// Initialize enhanced neural network when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    new EnhancedNeuralNetwork('particle-canvas');
  }
}); 