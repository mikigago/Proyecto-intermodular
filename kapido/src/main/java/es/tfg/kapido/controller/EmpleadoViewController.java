package es.tfg.kapido.controller;

import es.tfg.kapido.model.CargoEmpleado;
import es.tfg.kapido.model.Empleado;
import es.tfg.kapido.service.EmpleadoService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
//CODE REVIEW 

@Controller
@RequestMapping("/empleados")
public class EmpleadoViewController {

    private final EmpleadoService empleadoService;

    public EmpleadoViewController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("empleados", empleadoService.findAll());
        return "empleados/lista";
    }

    @GetMapping("/{id}")
    public String ver(@PathVariable Long id, Model model) {
        model.addAttribute("empleado", empleadoService.findById(id));
        return "empleados/detalle";
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioNuevo(Model model) {
        model.addAttribute("empleado", new Empleado());
        model.addAttribute("cargos", CargoEmpleado.values());
        return "empleados/formulario";
    }

    @PostMapping("/nuevo")
    public String crear(@Valid @ModelAttribute Empleado empleado, 
                       BindingResult result,
                       Model model,
                       RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("cargos", CargoEmpleado.values());
            return "empleados/formulario";
        }
        
        empleadoService.save(empleado);
        redirectAttributes.addFlashAttribute("mensaje", "Empleado creado exitosamente");
        return "redirect:/empleados";
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditar(@PathVariable Long id, Model model) {
        model.addAttribute("empleado", empleadoService.findById(id));
        model.addAttribute("cargos", CargoEmpleado.values());
        return "empleados/formulario";
    }

    @PostMapping("/editar/{id}")
    public String editar(@PathVariable Long id,
                        @Valid @ModelAttribute Empleado empleado,
                        BindingResult result,
                        Model model,
                        RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            model.addAttribute("cargos", CargoEmpleado.values());
            return "empleados/formulario";
        }
        
        empleadoService.update(id, empleado);
        redirectAttributes.addFlashAttribute("mensaje", "Empleado actualizado exitosamente");
        return "redirect:/empleados";
    }

    @PostMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        empleadoService.delete(id);
        redirectAttributes.addFlashAttribute("mensaje", "Empleado eliminado exitosamente");
        return "redirect:/empleados";
    }
}
